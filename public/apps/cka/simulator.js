(function () {
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const contexts = ["training", "staging", "production"];
  const base = () => ({
    namespaces: ["default", "kube-system", "shop"],
    nodes: [
      { name: "control-1", status: "Ready", roles: "control-plane", labels: { "kubernetes.io/hostname": "control-1", "node-role.kubernetes.io/control-plane": "" }, taints: ["node-role.kubernetes.io/control-plane:NoSchedule"], cpu: "4", memory: "8Gi" },
      { name: "worker-a", status: "Ready", roles: "<none>", labels: { "kubernetes.io/hostname": "worker-a", zone: "west" }, taints: [], cpu: "4", memory: "8Gi" },
      { name: "worker-b", status: "Ready", roles: "<none>", labels: { "kubernetes.io/hostname": "worker-b", zone: "east" }, taints: [], cpu: "4", memory: "8Gi" }
    ],
    deployments: {},
    pods: {},
    services: {},
    configmaps: {},
    secrets: {},
    pvcs: {},
    events: [],
    nodeShell: null
  });
  const clusters = Object.fromEntries(contexts.map((name) => [name, base()]));
  let currentContext = "training";
  let history = [];
  const current = () => clusters[currentContext];

  function namespace(name) { return name || "default"; }
  function normalizeResource(value) {
    const names = {
      po: "pods", pod: "pods", pods: "pods",
      deploy: "deployments", deployment: "deployments", deployments: "deployments",
      rs: "replicasets", replicaset: "replicasets", replicasets: "replicasets",
      svc: "services", service: "services", services: "services",
      ns: "namespaces", namespace: "namespaces", namespaces: "namespaces",
      no: "nodes", node: "nodes", nodes: "nodes",
      cm: "configmaps", configmap: "configmaps", configmaps: "configmaps",
      secret: "secrets", secrets: "secrets", pvc: "pvcs", pvcs: "pvcs",
      event: "events", events: "events"
    };
    return names[(value || "").toLowerCase()] || null;
  }
  function argsAfter(args, flag, fallback) {
    const index = args.indexOf(flag);
    if (index >= 0 && args[index + 1]) return args[index + 1];
    const prefix = args.find((arg) => arg.startsWith(flag + "="));
    return prefix ? prefix.slice(flag.length + 1) : fallback;
  }
  function flagValue(args, name, fallback) {
    const match = args.find((arg) => arg.startsWith(name + "="));
    if (match) return match.slice(name.length + 1);
    return argsAfter(args, name, fallback);
  }
  function split(input) {
    const output = [];
    let value = "";
    let quote = "";
    for (const char of input) {
      if (quote) {
        if (char === quote) quote = "";
        else value += char;
      } else if (char === "'" || char === '"') quote = char;
      else if (/\s/.test(char)) {
        if (value) output.push(value);
        value = "";
      } else value += char;
    }
    if (value) output.push(value);
    return output;
  }
  function addPod(name, ns, image, labels, owner, status) {
    const cluster = current();
    const pod = { name, namespace: ns, image, labels: clone(labels || {}), owner: owner || "", status: status || "Running", ready: status === "Running" ? "1/1" : "0/1", node: "worker-a", restarts: 0 };
    cluster.pods[ns + "/" + name] = pod;
    return pod;
  }
  function reconcile(dep) {
    const cluster = current();
    const key = dep.namespace + "/" + dep.name;
    const existing = Object.values(cluster.pods).filter((pod) => pod.owner === key);
    while (existing.length > dep.replicas) {
      const pod = existing.pop();
      delete cluster.pods[dep.namespace + "/" + pod.name];
    }
    while (existing.length < dep.replicas) {
      existing.push(addPod(dep.name + "-" + Math.random().toString(36).slice(2, 7), dep.namespace, dep.image, dep.labels, key));
    }
    existing.forEach((pod) => {
      pod.image = dep.image;
      pod.labels = clone(dep.labels || {});
    });
    dep.ready = existing.filter((pod) => pod.status === "Running").length;
    dep.available = dep.ready;
  }
  function listPods(ns, allNs) {
    return Object.values(current().pods).filter((pod) => allNs || pod.namespace === ns);
  }
  function getDeployments(ns, allNs) {
    return Object.values(current().deployments).filter((dep) => allNs || dep.namespace === ns);
  }
  function getServices(ns, allNs) {
    return Object.values(current().services).filter((svc) => allNs || svc.namespace === ns);
  }
  function tablePods(pods, wide) {
    const head = wide ? "NAME                 READY   STATUS    RESTARTS   AGE   IP            NODE" : "NAME                 READY   STATUS    RESTARTS   AGE";
    return [head].concat(pods.map((p) => `${p.name.padEnd(20)} ${p.ready.padEnd(7)} ${p.status.padEnd(9)} ${String(p.restarts).padEnd(10)} 2m${wide ? "    10.244.1.12   " + p.node : ""}`)).join("\n");
  }
  function tableDeployments(items) {
    return ["NAME              READY   UP-TO-DATE   AVAILABLE   AGE"].concat(items.map((d) => `${d.name.padEnd(17)} ${d.ready}/${d.replicas}     ${String(d.replicas).padEnd(11)} ${String(d.available).padEnd(11)} 2m`)).join("\n");
  }
  function tableServices(items) {
    return ["NAME              TYPE        CLUSTER-IP      PORT(S)         AGE"].concat(items.map((s) => `${s.name.padEnd(17)} ${s.type.padEnd(11)} ${s.ip.padEnd(15)} ${s.port}/${s.protocol}       2m`)).join("\n");
  }
  function errorUnsupported(command) {
    return `[simulator] this command is not emulated: ${command}\nSee the Command Coverage page for supported commands. No cluster state was changed.`;
  }

  function kubectl(parts) {
    const cluster = current();
    const sub = parts.shift();
    const ns = namespace(argsAfter(parts, "-n", argsAfter(parts, "--namespace", "default")));
    const allNs = parts.includes("-A") || parts.includes("--all-namespaces");
    if (!sub) return "kubectl: a subcommand is required";
    if (sub === "config") {
      const op = parts[0];
      if (op === "current-context") return currentContext;
      if (op === "get-contexts") return ["CURRENT   NAME        CLUSTER", ...contexts.map((name) => `${name === currentContext ? "*" : " "}         ${name.padEnd(11)} ${name}`)].join("\n");
      if (op === "use-context" && contexts.includes(parts[1])) { currentContext = parts[1]; return `Switched to context "${currentContext}"`; }
      if (op === "use-context") return `error: context "${parts[1] || ""}" does not exist`;
      return errorUnsupported("kubectl config " + parts.join(" "));
    }
    if (sub === "get") {
      const resource = normalizeResource(parts[0]);
      const name = parts[1] && !parts[1].startsWith("-") ? parts[1] : null;
      if (!resource) return errorUnsupported("kubectl get " + parts.join(" "));
      const output = flagValue(parts, "-o", flagValue(parts, "--output", ""));
      if ((output && !(output === "wide" && resource === "pods")) || parts.includes("--sort-by") || parts.includes("--selector") || parts.includes("-l")) {
        return errorUnsupported("kubectl get " + parts.join(" "));
      }
      if (resource === "namespaces") return "NAME\n" + cluster.namespaces.join("\n");
      if (resource === "nodes") return ["NAME       STATUS   ROLES           AGE   VERSION", ...cluster.nodes.map((n) => `${n.name.padEnd(10)} ${n.status.padEnd(8)} ${n.roles.padEnd(15)} 18d   v1.37.0`)].join("\n");
      if (resource === "pods") return tablePods(listPods(ns, allNs).filter((p) => !name || p.name === name), parts.includes("-o") && argsAfter(parts, "-o", "") === "wide");
      if (resource === "deployments") return tableDeployments(getDeployments(ns, allNs).filter((d) => !name || d.name === name));
      if (resource === "services") return tableServices(getServices(ns, allNs).filter((s) => !name || s.name === name));
      if (resource === "configmaps") return "NAME              DATA   AGE\n" + Object.values(cluster.configmaps).filter((item) => (allNs || item.namespace === ns) && (!name || item.name === name)).map((x) => `${x.name.padEnd(17)} ${Object.keys(x.data).length}      2m`).join("\n");
      if (resource === "secrets") return "NAME              TYPE     DATA   AGE\n" + Object.values(cluster.secrets).filter((item) => item.namespace === ns && (!name || item.name === name)).map((x) => `${x.name.padEnd(17)} Opaque   ${Object.keys(x.data).length}      2m`).join("\n");
      if (resource === "pvcs") return "NAME              STATUS   VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE\n" + Object.values(cluster.pvcs).filter((item) => item.namespace === ns && (!name || item.name === name)).map((x) => `${x.name.padEnd(17)} ${x.status}      <none>   ${x.size}        ${x.mode}            ${x.storageClass}      2m`).join("\n");
      if (resource === "events") return "LAST SEEN   TYPE     REASON               OBJECT   MESSAGE\n" + cluster.events.slice(-12).map((x) => `1m          ${x.type}   ${x.reason.padEnd(20)} ${x.object}   ${x.message}`).join("\n");
      return errorUnsupported("kubectl get " + parts.join(" "));
    }
    if (sub === "create") {
      const resource = parts[0];
      if (parts.some((value) => value.startsWith("--dry-run"))) {
        const output = flagValue(parts, "-o", flagValue(parts, "--output", ""));
        if (output !== "yaml" || resource !== "deployment") return errorUnsupported("kubectl create " + parts.join(" "));
        const name = parts[1] || "generated";
        const image = flagValue(parts, "--image", "");
        if (!image) return "error: --image is required";
        const replicas = flagValue(parts, "--replicas", "1");
        return `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ${name}\nspec:\n  replicas: ${replicas}\n  selector:\n    matchLabels:\n      app: ${name}\n  template:\n    metadata:\n      labels:\n        app: ${name}\n    spec:\n      containers:\n      - name: ${name}\n        image: ${image}`;
      }
      if (resource === "namespace" || resource === "ns") {
        if (!parts[1]) return "error: NAME is required";
        if (cluster.namespaces.includes(parts[1])) return `Error from server (AlreadyExists): namespaces "${parts[1]}" already exists`;
        cluster.namespaces.push(parts[1]); return `namespace/${parts[1]} created`;
      }
      if (resource === "deployment") {
        const name = parts[1]; if (!name) return "error: NAME is required";
        const image = flagValue(parts, "--image", "");
        if (!image) return "error: --image is required";
        const key = ns + "/" + name;
        if (cluster.deployments[key]) return `Error from server (AlreadyExists): deployments.apps "${name}" already exists`;
        const replicas = Number(flagValue(parts, "--replicas", "1"));
        const dep = { name, namespace: ns, image, replicas, ready: 0, available: 0, labels: { app: name }, generation: 1, revision: 1 };
        cluster.deployments[key] = dep; reconcile(dep);
        return `deployment.apps/${name} created`;
      }
      if (resource === "configmap" || resource === "cm" || resource === "secret") {
        const nameIndex = resource === "secret" && parts[1] === "generic" ? 2 : 1;
        if (resource === "secret" && nameIndex !== 2) return errorUnsupported("kubectl create secret " + parts.slice(1).join(" "));
        const name = parts[nameIndex]; if (!name) return "error: NAME is required";
        const data = {};
        parts.filter((x) => x.startsWith("--from-literal=")).forEach((x) => {
          const pair = x.slice(15).split("="); data[pair.shift()] = pair.join("=");
        });
        if (!Object.keys(data).length) return "error: at least one --from-literal=KEY=VALUE is required";
        const target = resource === "secret" ? cluster.secrets : cluster.configmaps;
        target[ns + "/" + name] = { name, namespace: ns, data };
        return `${resource === "secret" ? "secret" : "configmap"}/${name} created`;
      }
      if (resource === "pod" || resource === "run") {
        const name = parts[1]; const image = flagValue(parts, "--image", "");
        if (!name || !image) return "error: NAME and --image are required";
        addPod(name, ns, image, { run: name }, "");
        return `pod/${name} created`;
      }
      return errorUnsupported("kubectl create " + parts.join(" "));
    }
    if (sub === "run") {
      const name = parts[0]; const image = flagValue(parts, "--image", "");
      if (!name || !image) return "error: NAME and --image are required";
      addPod(name, ns, image, { run: name }, "");
      return `pod/${name} created`;
    }
    if (sub === "scale") {
      const target = (parts[0] || "").split("/");
      const name = target.pop();
      if (!["deployment", "deploy", "replicaset", "rs"].includes(target[0])) return errorUnsupported("kubectl scale " + parts.join(" "));
      const dep = cluster.deployments[ns + "/" + name];
      if (!dep) return `Error from server (NotFound): deployments.apps "${name}" not found`;
      const replicas = Number(flagValue(parts, "--replicas", ""));
      if (!Number.isInteger(replicas) || replicas < 0 || replicas > 30) return "error: --replicas must be an integer between 0 and 30";
      dep.replicas = replicas; dep.generation++; reconcile(dep);
      return `deployment.apps/${name} scaled`;
    }
    if (sub === "set" && parts[0] === "image") {
      const target = (parts[1] || "").split("/"); const dep = cluster.deployments[ns + "/" + target[target.length - 1]];
      const assignment = parts[2] || "";
      if (!dep || !assignment.includes("=")) return "error: use kubectl set image deployment/NAME CONTAINER=IMAGE";
      dep.previousImage = dep.image;
      dep.image = assignment.split("=").slice(1).join("="); dep.revision++; dep.generation++; reconcile(dep);
      return `deployment.apps/${dep.name} image updated`;
    }
    if (sub === "rollout") {
      const op = parts[0]; const name = (parts[1] || "").split("/").pop(); const dep = cluster.deployments[ns + "/" + name];
      if (!dep) return `Error from server (NotFound): deployments.apps "${name}" not found`;
      if (op === "status") return `deployment "${name}" successfully rolled out`;
      if (op === "history") return `deployment.apps/${name}\nREVISION  CHANGE-CAUSE\n${Math.max(1, dep.revision - 1)}         <none>\n${dep.revision}         <none>`;
      if (op === "undo") {
        if (!dep.previousImage) return `error: no previous revision recorded for deployment "${name}"`;
        const image = dep.image; dep.image = dep.previousImage; dep.previousImage = image;
        dep.revision = Math.max(1, dep.revision - 1); dep.generation++; reconcile(dep);
        return `deployment.apps/${name} rolled back`;
      }
      return errorUnsupported("kubectl rollout " + parts.join(" "));
    }
    if (sub === "expose") {
      const target = (parts[0] || "").split("/");
      if (!["deployment", "deploy", "pod"].includes(target[0])) return errorUnsupported("kubectl expose " + parts.join(" "));
      const depName = target[1] || parts[1]; const dep = cluster.deployments[ns + "/" + depName];
      if (!dep) return `Error from server (NotFound): deployments.apps "${depName}" not found`;
      const name = flagValue(parts, "--name", depName);
      const port = Number(flagValue(parts, "--port", "80"));
      const targetPort = Number(flagValue(parts, "--target-port", String(port)));
      const type = flagValue(parts, "--type", "ClusterIP");
      cluster.services[ns + "/" + name] = { name, namespace: ns, selector: clone(dep.labels), port, targetPort, type, protocol: "TCP", ip: "10.96." + (20 + Object.keys(cluster.services).length) + ".1" };
      return `service/${name} exposed`;
    }
    if (sub === "delete") {
      const resource = normalizeResource(parts[0]); const name = parts[1];
      if (!resource || !name) return "error: resource and name are required";
      if (resource === "deployments") {
        const dep = cluster.deployments[ns + "/" + name]; if (!dep) return `Error from server (NotFound): deployments.apps "${name}" not found`;
        delete cluster.deployments[ns + "/" + name];
        Object.keys(cluster.pods).filter((key) => cluster.pods[key].owner === ns + "/" + name).forEach((key) => delete cluster.pods[key]);
      } else if (resource === "pods") delete cluster.pods[ns + "/" + name];
      else if (resource === "services") delete cluster.services[ns + "/" + name];
      else if (resource === "namespaces") cluster.namespaces = cluster.namespaces.filter((x) => x !== name);
      else return errorUnsupported("kubectl delete " + parts.join(" "));
      return `${resource}/${name} deleted`;
    }
    if (sub === "label" || sub === "annotate") {
      const resource = normalizeResource(parts[0]); const name = parts[1];
      const assignment = parts.find((x) => x.includes("=") && !x.startsWith("--"));
      if (!resource || !name || !assignment) return "error: expected RESOURCE NAME key=value";
      if (!["nodes", "pods"].includes(resource)) return errorUnsupported("kubectl " + sub + " " + parts.join(" "));
      const item = resource === "nodes" ? cluster.nodes.find((x) => x.name === name) : cluster.pods[ns + "/" + name];
      if (!item) return `Error from server (NotFound): ${resource} "${name}" not found`;
      const [key, ...rest] = assignment.split("="); item.labels = item.labels || {}; item.labels[key] = rest.join("=");
      return `${resource}/${name} labeled`;
    }
    if (sub === "taint") {
      if (parts[0] !== "nodes" || !cluster.nodes.some((n) => n.name === parts[1]) || !parts[2]) return "error: use kubectl taint nodes NODE key=value:effect";
      const node = cluster.nodes.find((n) => n.name === parts[1]); node.taints.push(parts[2]); return `node/${node.name} tainted`;
    }
    if (sub === "cordon" || sub === "uncordon" || sub === "drain") {
      const node = cluster.nodes.find((n) => n.name === parts[0]);
      if (!node) return `Error from server (NotFound): node "${parts[0] || ""}" not found`;
      if (sub === "cordon") { node.status = "SchedulingDisabled"; return `node/${node.name} cordoned`; }
      if (sub === "uncordon") { node.status = "Ready"; return `node/${node.name} uncordoned`; }
      node.status = "SchedulingDisabled"; return `node/${node.name} cordoned\nnode/${node.name} drained`;
    }
    if (sub === "describe") {
      const resource = normalizeResource(parts[0]); const name = parts[1];
      if (resource === "pods") {
        const pod = cluster.pods[ns + "/" + name];
        if (!pod) return `Error from server (NotFound): pods "${name || ""}" not found`;
        return `Name:         ${pod.name}\nNamespace:    ${pod.namespace}\nNode:         ${pod.node}\nStatus:       ${pod.status}\nContainers:\n  ${pod.name}:\n    Image:     ${pod.image}\nEvents:\n  Type    Reason     Message\n  Normal  Scheduled  Successfully assigned ${pod.namespace}/${pod.name} to ${pod.node}`;
      }
      if (resource === "nodes") {
        const node = cluster.nodes.find((item) => item.name === name);
        if (!node) return `Error from server (NotFound): nodes "${name || ""}" not found`;
        return `Name:               ${node.name}\nRoles:              ${node.roles}\nConditions:\n  Ready:            ${node.status}\nCapacity:\n  cpu:              ${node.cpu}\n  memory:           ${node.memory}\nTaints:             ${node.taints.join(", ") || "<none>"}`;
      }
      if (resource === "deployments") {
        const dep = cluster.deployments[ns + "/" + name];
        if (!dep) return `Error from server (NotFound): deployments.apps "${name || ""}" not found`;
        return `Name:               ${dep.name}\nNamespace:          ${dep.namespace}\nReplicas:           ${dep.ready} desired | ${dep.ready} updated | ${dep.available} available\nPod Template:\n  Labels: app=${dep.name}\n  Containers:\n   ${dep.name}:\n    Image: ${dep.image}`;
      }
      return errorUnsupported("kubectl describe " + parts.join(" "));
    }
    if (sub === "logs") {
      const name = parts[0]; const pod = cluster.pods[ns + "/" + name];
      if (!pod) return `Error from server (NotFound): pods "${name || ""}" not found`;
      return `[${pod.name}] simulated application log: started with image ${pod.image}`;
    }
    if (sub === "auth" && parts[0] === "can-i") {
      const verb = parts[1] || ""; const resource = parts[2] || "";
      return ["get", "list", "watch"].includes(verb) || ["default", "training-user"].includes(argsAfter(parts, "--as", "")) ? "yes" : "no";
    }
    if (sub === "explain") return `${parts[0] || "resource"}\nDESCRIPTION:\n  Simulated schema reference. Use the built-in Reference Library for a fuller field guide.`;
    if (sub === "api-resources") return "NAME          SHORTNAMES   APIVERSION   NAMESPACED   KIND\ndeployments   deploy       apps/v1      true         Deployment\npods          po           v1           true         Pod\nservices      svc          v1           true         Service";
    if (sub === "wait") {
      const condition = flagValue(parts, "--for", "");
      const target = parts.find((part) => part.includes("/")) || "";
      const [resourceName, objectName] = target.split("/");
      if (condition === "condition=Ready" && ["pod", "pods"].includes(resourceName)) {
        const pod = cluster.pods[ns + "/" + objectName];
        return pod && pod.status === "Running" ? `pod/${objectName} condition met` : `error: timed out waiting for the condition on pods/${objectName}`;
      }
      if (condition === "condition=Available" && ["deployment", "deployments"].includes(resourceName)) {
        const dep = cluster.deployments[ns + "/" + objectName];
        return dep && dep.ready === dep.replicas && dep.replicas > 0 ? `deployment.apps/${objectName} condition met` : `error: timed out waiting for the condition on deployments/${objectName}`;
      }
      return errorUnsupported("kubectl wait " + parts.join(" "));
    }
    if (sub === "top") {
      const resource = normalizeResource(parts[0]);
      if (resource !== "pods") return errorUnsupported("kubectl top " + parts.join(" "));
      const pods = listPods(ns, allNs);
      return ["NAME                 CPU(cores)   MEMORY(bytes)", ...pods.map((pod) => `${pod.name.padEnd(20)} 12m          48Mi`)].join("\n");
    }
    if (sub === "apply" || sub === "patch" || sub === "edit" || sub === "exec" || sub === "rollout") return errorUnsupported("kubectl " + [sub, ...parts].join(" "));
    return errorUnsupported("kubectl " + [sub, ...parts].join(" "));
  }

  function command(line) {
    const input = line.trim();
    if (!input) return "";
    history.push(input);
    const tokens = split(input);
    const root = tokens.shift();
    if (root === "kubectl") return kubectl(tokens);
    if (root === "clear") return "\u0000CLEAR";
    if (root === "help") return "Supported: kubectl get/create/run/scale/set image/rollout/expose/delete/describe/logs/config/auth/taint/cordon/drain/uncordon/api-resources/explain/wait/top; pwd, hostname, ls, cat, grep, systemctl status, journalctl, nslookup, dig, ip, ss, ssh.";
    if (root === "pwd") return current().nodeShell ? "/etc/kubernetes" : "/home/student";
    if (root === "hostname") return current().nodeShell || "student";
    if (root === "ls") return current().nodeShell ? "manifests  pki  kubelet  containerd" : "README.txt  pod.yaml  deployment.yaml";
    if (root === "cat") {
      const path = tokens[0] || "";
      if (path.includes("hostname")) return current().nodeShell || "student";
      if (path.includes("kubelet/config.yaml")) return "apiVersion: kubelet.config.k8s.io/v1beta1\nkind: KubeletConfiguration\ncgroupDriver: systemd";
      if (path.includes("manifests/")) return "# Simulated static Pod manifest\napiVersion: v1\nkind: Pod\nmetadata:\n  name: kube-apiserver";
      if (path.includes("deployment.yaml")) return "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: demo\nspec:\n  replicas: 2";
      return `cat: ${path}: No such file or directory`;
    }
    if (root === "grep") {
      const withLine = tokens[0] === "-n";
      if (withLine) tokens.shift();
      const pattern = tokens[0] || "";
      const path = tokens[1] || "";
      const text = path.includes("deployment.yaml") ? "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: demo\nspec:\n  replicas: 2\n  template:\n    spec:\n      containers:\n      - name: web\n        image: nginx:1.27" : path.includes("pod.yaml") ? "apiVersion: v1\nkind: Pod\nmetadata:\n  name: practice\nspec:\n  containers:\n  - name: app\n    image: busybox:1.36" : "";
      if (!text) return `grep: ${path || "FILE"}: No such file or directory`;
      const matches = text.split("\n").map((line, index) => ({ line, index })).filter((item) => item.line.includes(pattern));
      return matches.map((item) => withLine ? `${item.index + 1}:${item.line}` : item.line).join("\n") || " ";
    }
    if (root === "systemctl" && tokens[0] === "status") return `${tokens[1] || "kubelet"}.service - ${tokens[1] || "kubelet"}\n   Active: active (running) since 2 days ago`;
    if (root === "journalctl") return "-- Logs begin at simulated boot --\n kubelet[821]: Node is registered and status is healthy";
    if (root === "nslookup" || root === "dig") return `Server: 10.96.0.10\nName: ${tokens[0] || "service.default.svc"}\nAddress: 10.96.24.1`;
    if (root === "ip") return "lo 127.0.0.1/8\neth0 10.244.1.12/24";
    if (root === "ss" || root === "netstat") return "State   Recv-Q  Send-Q  Local Address:Port   Peer Address:Port\nLISTEN  0       128     0.0.0.0:10250       0.0.0.0:*";
    if (root === "ssh") {
      const node = current().nodes.find((item) => item.name === tokens[0]);
      if (!node) return `ssh: Could not resolve hostname ${tokens[0] || ""}: Name or service not known`;
      current().nodeShell = node.name;
      return `Connected to ${node.name}. Simulated node shell. Type exit to return.`;
    }
    if (root === "exit" && current().nodeShell) { const old = current().nodeShell; current().nodeShell = null; return `Connection to ${old} closed.`; }
    if (root === "vim" || root === "nano") return `[simulator] ${root} is not emulated in this release. No file was changed.`;
    if (["mkdir", "cp", "mv", "chmod", "curl", "etcdctl", "kubeadm", "crictl", "helm", "kustomize"].includes(root)) return errorUnsupported(root + (tokens.length ? " " + tokens.join(" ") : ""));
    return errorUnsupported(input);
  }

  function reset() {
    contexts.forEach((name) => { clusters[name] = base(); });
    currentContext = "training";
    history = [];
  }
  function snapshot() {
    return { currentContext, contexts: clone(contexts), clusters: clone(clusters), history: clone(history) };
  }
  function restore(value) {
    if (!value || !contexts.includes(value.currentContext) || !value.clusters) throw new Error("Invalid simulator snapshot");
    currentContext = value.currentContext;
    contexts.forEach((name) => { clusters[name] = clone(value.clusters[name] || base()); });
    history = Array.isArray(value.history) ? clone(value.history) : [];
  }

  function checks() {
    return [
      {
        id: "deploy-three",
        title: "Scale a Deployment to three replicas",
        description: "In the default namespace, create a Deployment named `web-practice` with image `nginx:1.27` and three ready replicas.",
        namespace: "default", weight: 10, hint: "Create it with kubectl, then set the replica count.", strongerHint: "Try `kubectl create deployment web-practice --image=nginx:1.27` and `kubectl scale deployment/web-practice --replicas=3`.", solution: ["kubectl create deployment web-practice --image=nginx:1.27", "kubectl scale deployment/web-practice --replicas=3"],
        grade() { const d = current().deployments["default/web-practice"]; return [{ label: "Deployment exists with requested image", pass: !!d && d.image === "nginx:1.27" }, { label: "Three replicas are ready", pass: !!d && d.ready === 3 && d.replicas === 3 }]; }
      },
      {
        id: "expose-shop",
        title: "Expose an app inside the cluster",
        description: "Create a Deployment named `inventory` with image `nginx:1.27`, then expose it as a ClusterIP Service on port 80.",
        namespace: "shop", weight: 10, hint: "A Service selector must match the Deployment's Pod labels.", strongerHint: "Create in `shop` using `-n shop`, then use `kubectl expose deployment inventory --port=80 -n shop`.", solution: ["kubectl create deployment inventory --image=nginx:1.27 -n shop", "kubectl expose deployment inventory --port=80 -n shop"],
        grade() { const d = current().deployments["shop/inventory"], s = current().services["shop/inventory"]; return [{ label: "Deployment uses requested image", pass: !!d && d.image === "nginx:1.27" }, { label: "ClusterIP Service exposes port 80 with matching selector", pass: !!s && s.port === 80 && s.type === "ClusterIP" && !!d && s.selector.app === d.name }]; }
      },
      {
        id: "config-map",
        title: "Create application configuration",
        description: "In namespace `shop`, create ConfigMap `checkout-settings` with key `MODE` and value `practice`.",
        namespace: "shop", weight: 8, hint: "Use `kubectl create configmap` with a literal key/value.", strongerHint: "Run `kubectl create configmap checkout-settings --from-literal=MODE=practice -n shop`.", solution: ["kubectl create configmap checkout-settings --from-literal=MODE=practice -n shop"],
        grade() { const x = current().configmaps["shop/checkout-settings"]; return [{ label: "ConfigMap exists in shop", pass: !!x }, { label: "MODE has the requested value", pass: !!x && x.data.MODE === "practice" }]; }
      },
      {
        id: "context-switch",
        title: "Select the intended cluster",
        description: "Switch the active context to `staging` and confirm the selected context.",
        namespace: "default", weight: 5, hint: "Use kubectl's config subcommand.", strongerHint: "Use `kubectl config use-context staging`.", solution: ["kubectl config use-context staging"],
        grade() { return [{ label: "Active context is staging", pass: currentContext === "staging" }]; }
      },
      {
        id: "deployment-update",
        title: "Update a running image",
        description: "In namespace `shop`, update Deployment `payments` to image `nginx:1.28`.",
        namespace: "shop", weight: 10, hint: "Use the image update operation on the Deployment.", strongerHint: "Create a `payments` Deployment if needed, then use `kubectl set image deployment/payments payments=nginx:1.28 -n shop`.", solution: ["kubectl create deployment payments --image=nginx:1.27 -n shop", "kubectl set image deployment/payments payments=nginx:1.28 -n shop"],
        grade() { const d = current().deployments["shop/payments"]; return [{ label: "Deployment exists in shop", pass: !!d }, { label: "Deployment and Pods use nginx:1.28", pass: !!d && d.image === "nginx:1.28" && listPods("shop", false).filter((p) => p.owner === "shop/payments").every((p) => p.image === "nginx:1.28") }]; }
      },
      {
        id: "node-label",
        title: "Label a worker node",
        description: "Add label `disk=ssd` to node `worker-b`.",
        namespace: "default", weight: 5, hint: "Node labels are cluster-scoped, not namespaced.", strongerHint: "Run `kubectl label node worker-b disk=ssd`.", solution: ["kubectl label node worker-b disk=ssd"],
        grade() { const n = current().nodes.find((x) => x.name === "worker-b"); return [{ label: "worker-b has disk=ssd", pass: !!n && n.labels.disk === "ssd" }]; }
      },
      {
        id: "create-namespace",
        title: "Create an isolated workspace",
        description: "Create the namespace `observability` and verify that it appears in the namespace list.",
        namespace: "default", weight: 5, hint: "A namespace is cluster-scoped; which kubectl resource names it?", strongerHint: "Try `kubectl create namespace observability`, then list namespaces.", solution: ["kubectl create namespace observability"],
        grade() { return [{ label: "observability namespace exists", pass: current().namespaces.includes("observability") }]; }
      },
      {
        id: "run-pod",
        title: "Start a one-off diagnostic Pod",
        description: "In namespace `shop`, create Pod `netcheck` from image `busybox:1.36` and confirm that it is Running.",
        namespace: "shop", weight: 8, hint: "Which imperative command starts a single Pod rather than a controller?", strongerHint: "Use `kubectl run` with the Pod name, image, and namespace.", solution: ["kubectl run netcheck --image=busybox:1.36 -n shop"],
        grade() { const pod = current().pods["shop/netcheck"]; return [{ label: "netcheck exists in shop", pass: !!pod }, { label: "Pod uses busybox:1.36 and is Running", pass: !!pod && pod.image === "busybox:1.36" && pod.status === "Running" }]; }
      },
      {
        id: "create-secret",
        title: "Provide a simulated application credential",
        description: "Create Secret `api-credentials` in namespace `shop` with key `token` and value `training-only`.",
        namespace: "shop", weight: 8, hint: "Which create subcommand accepts key/value literals for sensitive application configuration?", strongerHint: "Use `kubectl create secret generic` with `--from-literal=token=training-only` and `-n shop`.", solution: ["kubectl create secret generic api-credentials --from-literal=token=training-only -n shop"],
        grade() { const secret = current().secrets["shop/api-credentials"]; return [{ label: "api-credentials Secret exists in shop", pass: !!secret }, { label: "token has the requested value", pass: !!secret && secret.data.token === "training-only" }]; }
      },
      {
        id: "expose-nodeport",
        title: "Expose a workload through a node port",
        description: "Create Deployment `catalog` in `shop` with image `nginx:1.27`, then expose it as NodePort `catalog-public` on port 8080.",
        namespace: "shop", weight: 8, hint: "Which Service type exposes a service through a port on each node?", strongerHint: "Create the Deployment, then use `kubectl expose` with `--name`, `--port=8080`, and `--type=NodePort`.", solution: ["kubectl create deployment catalog --image=nginx:1.27 -n shop", "kubectl expose deployment catalog --name=catalog-public --port=8080 --type=NodePort -n shop"],
        grade() { const dep = current().deployments["shop/catalog"], service = current().services["shop/catalog-public"]; return [{ label: "catalog Deployment uses nginx:1.27", pass: !!dep && dep.image === "nginx:1.27" }, { label: "catalog-public is a NodePort Service on port 8080", pass: !!service && service.type === "NodePort" && service.port === 8080 }, { label: "Service selector matches the Deployment", pass: !!dep && !!service && service.selector.app === dep.name }]; }
      },
      {
        id: "taint-node",
        title: "Reserve a node for a workload class",
        description: "Add taint `dedicated=infra:NoSchedule` to node `worker-b`.",
        namespace: "default", weight: 8, hint: "A NoSchedule taint repels Pods unless they tolerate it. Which node-level command adds one?", strongerHint: "Use `kubectl taint nodes worker-b dedicated=infra:NoSchedule`.", solution: ["kubectl taint nodes worker-b dedicated=infra:NoSchedule"],
        grade() { const node = current().nodes.find((item) => item.name === "worker-b"); return [{ label: "worker-b has the dedicated=infra:NoSchedule taint", pass: !!node && node.taints.includes("dedicated=infra:NoSchedule") }]; }
      },
      {
        id: "rollback-image",
        title: "Roll back a risky image change",
        description: "In namespace `shop`, ensure Deployment `frontend` uses `nginx:1.27` after undoing its update from `nginx:1.27` to `nginx:1.28`.",
        namespace: "shop", weight: 10, hint: "Rollout history can be undone when a previous revision is recorded. What must happen before the rollback?", strongerHint: "Create `frontend`, update its image, then run `kubectl rollout undo deployment/frontend -n shop`.", solution: ["kubectl create deployment frontend --image=nginx:1.27 -n shop", "kubectl set image deployment/frontend frontend=nginx:1.28 -n shop", "kubectl rollout undo deployment/frontend -n shop"],
        grade() { const dep = current().deployments["shop/frontend"]; return [{ label: "frontend Deployment exists", pass: !!dep }, { label: "frontend is restored to nginx:1.27", pass: !!dep && dep.image === "nginx:1.27" }, { label: "frontend Pods use nginx:1.27", pass: !!dep && listPods("shop", false).filter((pod) => pod.owner === "shop/frontend").every((pod) => pod.image === "nginx:1.27") }]; }
      }
    ];
  }

  window.CKA_SIM = {
    command, reset, snapshot, restore, checks, get context() { return currentContext; },
    get state() { return current(); }, supportedContexts: contexts.slice()
  };
})();
