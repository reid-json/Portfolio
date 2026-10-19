studyTopics.push(
{
  "domain": "automation-programmability",
  "title": "Automation and Network Management",
  "points": [
    "Automation replaces repetitive manual steps with repeatable software-driven workflows.",
    "It improves speed, consistency, and scale while reducing routine human error.",
    "People remain responsible for design, policy, validation, and exceptions."
  ],
  "questions": [
    [
      "What is a primary benefit of automating routine network changes?",
      [
        "Consistent changes across many devices",
        "Every change becomes irreversible",
        "Routing protocols need no configuration",
        "Devices stop requiring monitoring"
      ],
      [
        0
      ],
      "A repeatable workflow applies intended steps at scale. Automation does not remove monitoring or the need to plan reversibility."
    ],
    [
      "A script configures one VLAN on 40 switches. What benefit is most direct?",
      [
        "It makes the VLAN dynamically routed",
        "It reduces manual effort and improves consistency",
        "Switches no longer need an operating system",
        "It replaces access controls"
      ],
      [
        1
      ],
      "A shared workflow reduces repetitive entry and configuration drift. It does not change switching functions or remove security needs."
    ],
    [
      "Which responsibility should remain with engineers when automation is used?",
      [
        "Typing every command on every device",
        "Copying all facts into reports manually",
        "Defining policy and reviewing high-impact changes",
        "Disabling telemetry before deployment"
      ],
      [
        2
      ],
      "Engineers should set policy and assess risk even when software executes changes. Automation does not replace design or oversight."
    ],
    [
      "Why can automation reduce configuration drift?",
      [
        "It guarantees identical syntax for all vendors",
        "It disables local access",
        "It removes the need for backups",
        "It can repeatedly enforce a known intended configuration"
      ],
      [
        3
      ],
      "Reconciliation to a defined state can reduce unintended differences. It does not guarantee identical vendor syntax or eliminate backups."
    ],
    [
      "Which two outcomes are commonly associated with well-designed automation?",
      [
        "Faster routine task execution",
        "Removal of all change review",
        "More repeatable configurations",
        "Automatic elimination of outages",
        "More manual entry per device"
      ],
      [
        0,
        2
      ],
      "Automation can accelerate routine work and make it repeatable. It cannot guarantee no outages or remove sensible review controls."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "Traditional and Controller-Based Operations",
  "points": [
    "Traditional management commonly configures and monitors devices individually.",
    "A controller offers a central logical point for policy and network-wide workflows.",
    "Central management does not remove the network devices themselves."
  ],
  "questions": [
    [
      "In traditional device-by-device management, where is a change commonly entered?",
      [
        "On each managed device or its local interface",
        "Only in a cloud analytics dashboard",
        "Only through a northbound API",
        "Inside an Ethernet frame"
      ],
      [
        0
      ],
      "Traditional workflows often require direct per-device configuration. A dashboard or API may assist but is not inherent to the model."
    ],
    [
      "What is a common advantage of controller-based management?",
      [
        "It eliminates forwarding tables",
        "It enables centrally managed policy across many devices",
        "It prevents all device failures",
        "It replaces southbound communication with user traffic"
      ],
      [
        1
      ],
      "A controller can provide central policy and orchestration. Forwarding devices still need tables and can still fail."
    ],
    [
      "What does centralized management generally mean?",
      [
        "Every packet must pass through the controller",
        "All devices become one physical chassis",
        "Policy can be expressed at a central logical point",
        "The controller handles only cabling records"
      ],
      [
        2
      ],
      "Central management refers to policy and operations, not necessarily packet forwarding through the controller."
    ],
    [
      "Why might a network still use device-level access after adopting a controller?",
      [
        "To ensure the controller never communicates with devices",
        "To make all APIs northbound",
        "To change IP into a link-layer address",
        "For troubleshooting, recovery, or operations not handled centrally"
      ],
      [
        3
      ],
      "Direct access can remain useful for recovery and troubleshooting. Controller adoption does not make devices inaccessible."
    ],
    [
      "Which two statements distinguish controller-based management?",
      [
        "Policy may be expressed centrally",
        "Every user must configure every interface manually",
        "The controller can coordinate changes across devices",
        "It removes all device operating systems",
        "It eliminates data-plane forwarding"
      ],
      [
        0,
        2
      ],
      "Central policy and coordinated changes are common benefits. Devices still run operating systems and forward traffic locally."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "SDN Planes and APIs",
  "points": [
    "The control plane makes forwarding decisions; the data plane forwards packets.",
    "The management plane supports configuration, monitoring, and administration.",
    "Northbound APIs connect applications to controllers; southbound APIs connect controllers to infrastructure."
  ],
  "questions": [
    [
      "Which plane primarily forwards packets through a router?",
      [
        "Data plane",
        "Management plane",
        "Control plane",
        "Application plane"
      ],
      [
        0
      ],
      "The data plane handles packet forwarding. The control plane computes decisions, and management supports administration."
    ],
    [
      "A routing protocol calculates a route and installs forwarding information. Which plane calculates it?",
      [
        "Data plane",
        "Control plane",
        "Management plane",
        "Presentation plane"
      ],
      [
        1
      ],
      "Route calculation is a control-plane function. The data plane uses resulting forwarding information to handle packets."
    ],
    [
      "A northbound API most commonly connects a controller to what?",
      [
        "Physical switch ports",
        "Optical transceivers",
        "Applications and orchestration systems",
        "Host network adapters"
      ],
      [
        2
      ],
      "Northbound interfaces expose controller capabilities to higher-level applications. Southbound interfaces communicate with infrastructure."
    ],
    [
      "Which best describes a southbound API in SDN?",
      [
        "It connects end users to a portal",
        "It connects an application to a business report",
        "It connects unrelated controllers only",
        "It lets a controller communicate with network devices"
      ],
      [
        3
      ],
      "Southbound communication links controllers with managed infrastructure. The application-facing direction is northbound."
    ],
    [
      "Which two are correctly matched to their roles?",
      [
        "Control plane — computes forwarding decisions",
        "Data plane — provides user login screens",
        "Management plane — administration and monitoring",
        "Northbound API — device-to-controller protocol only",
        "Data plane — configures access policies"
      ],
      [
        0,
        2
      ],
      "Control computes decisions and management supports operations. Login screens are not the data plane; device-facing APIs are typically southbound."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "Network Control Protocols",
  "points": [
    "OpenFlow is associated with programming flow-table behavior in SDN.",
    "NETCONF manages structured configuration, commonly over SSH using XML.",
    "RESTCONF exposes configuration and state through HTTP-based operations."
  ],
  "questions": [
    [
      "Which protocol is associated with controller-programmed flow tables in SDN?",
      [
        "OpenFlow",
        "TFTP",
        "Syslog",
        "NTP"
      ],
      [
        0
      ],
      "OpenFlow can program forwarding behavior in supported devices. The other choices serve file transfer, logging, or time synchronization."
    ],
    [
      "Which statement best describes NETCONF?",
      [
        "A protocol for resolving domain names",
        "A structured protocol for managing device configuration",
        "A link-state routing protocol",
        "A protocol only for encrypting payloads"
      ],
      [
        1
      ],
      "NETCONF installs, modifies, and retrieves configuration in a structured way. It is not a routing or name-resolution protocol."
    ],
    [
      "What is a typical transport and encoding combination for NETCONF?",
      [
        "HTTP with YAML",
        "UDP with CSV",
        "SSH with XML",
        "ICMP with JSON"
      ],
      [
        2
      ],
      "NETCONF commonly runs over SSH and uses XML-encoded messages. The other pairs are not its standard combination."
    ],
    [
      "Which protocol provides an HTTP-based interface to configuration and state?",
      [
        "OpenFlow",
        "SNMP trap",
        "RIP",
        "RESTCONF"
      ],
      [
        3
      ],
      "RESTCONF provides REST-like access to configuration and state using HTTP. The other options do not provide that interface."
    ],
    [
      "Which two statements about NETCONF and RESTCONF are accurate?",
      [
        "NETCONF commonly uses XML messages",
        "RESTCONF is an HTTP-based management interface",
        "Both are link-state protocols",
        "OpenFlow is RESTCONF's encoding format",
        "NETCONF only forwards packets"
      ],
      [
        0,
        1
      ],
      "NETCONF uses structured XML and RESTCONF uses HTTP resource operations. Neither is a routing protocol, and OpenFlow is not RESTCONF encoding."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "Cisco DNA Center and Device Management",
  "points": [
    "Cisco DNA Center centralizes network management and automation capabilities.",
    "Per-device management repeats actions on individual devices.",
    "Controllers coordinate workflows while devices continue local packet forwarding."
  ],
  "questions": [
    [
      "What is an advantage of DNA Center over configuring each switch separately?",
      [
        "It can centralize network-wide provisioning workflows",
        "It removes IP addressing",
        "It moves data-plane forwarding to the server",
        "It guarantees every device is from one vendor"
      ],
      [
        0
      ],
      "DNA Center can centralize provisioning and management. It does not remove addressing, move forwarding to the server, or mandate one vendor."
    ],
    [
      "Which task is well suited to per-device management?",
      [
        "Applying a policy to hundreds of sites",
        "Making a one-off change on one isolated device",
        "Comparing network-wide assurance trends",
        "Deploying a standard design repeatedly"
      ],
      [
        1
      ],
      "A one-off isolated change can be made directly on one device. Coordinated or repeated work benefits more from centralized workflows."
    ],
    [
      "A controller reports a switch's interface health. What does that imply about forwarding?",
      [
        "Packets are forwarded by the controller",
        "The switch has no control plane",
        "The switch still forwards packets locally",
        "The switch carries only management traffic"
      ],
      [
        2
      ],
      "A controller monitors health without needing to be in the packet path. The switch continues forwarding traffic locally."
    ],
    [
      "What is a benefit of centrally maintained network inventory?",
      [
        "Every device receives the same IP address",
        "Inventory removes the need for discovery",
        "Only end hosts can be included",
        "Operators can view and coordinate device information in one place"
      ],
      [
        3
      ],
      "Central inventory offers a shared operational view. It does not assign identical addresses or remove discovery requirements."
    ],
    [
      "Which two tasks are strong candidates for centralized automation?",
      [
        "Provisioning a standard branch design repeatedly",
        "A console-cable recovery on one failed device",
        "Coordinating policy across many access switches",
        "Replacing one chassis fan",
        "Cleaning a rack"
      ],
      [
        0,
        2
      ],
      "Repeated provisioning and coordinated policy benefit from central workflows. Console recovery and hardware repair are local physical work."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "Spine-Leaf Data Center Fabric",
  "points": [
    "Leaf-spine topology connects each leaf to multiple spines for predictable paths.",
    "Leaf switches commonly connect servers; spines interconnect the leaves.",
    "The design supports scale-out growth and multiple equal-cost paths."
  ],
  "questions": [
    [
      "In a spine-leaf topology, where are server-facing access ports most commonly found?",
      [
        "On leaf switches",
        "Only on spine switches",
        "On WAN routers only",
        "On the controller appliance"
      ],
      [
        0
      ],
      "Leaf switches commonly connect servers and endpoints. Spine switches primarily interconnect the leaves."
    ],
    [
      "What is the typical role of a spine switch?",
      [
        "Providing user authentication",
        "Interconnecting leaf switches",
        "Assigning hostnames to servers",
        "Replacing every leaf switch"
      ],
      [
        1
      ],
      "Spines provide high-speed interconnection between leaves. They do not normally replace leaf access or authentication systems."
    ],
    [
      "Why does a leaf typically connect to multiple spine switches?",
      [
        "To prevent IP routing",
        "To put all endpoints in one VLAN",
        "To provide multiple paths and predictable fabric connectivity",
        "To make all traffic pass through one leaf"
      ],
      [
        2
      ],
      "Multiple spine connections create path diversity and predictable leaf-to-leaf connectivity. They do not dictate one VLAN or eliminate routing."
    ],
    [
      "How does a spine-leaf network commonly scale when more servers are added?",
      [
        "Add a controller per server",
        "Convert links to serial connections",
        "Put all servers directly on one spine",
        "Add leaf switches connected to the spines"
      ],
      [
        3
      ],
      "Scale-out adds leaves for endpoint capacity and attaches them to the spine layer. Directly attaching all servers to a spine is not typical."
    ],
    [
      "Which two statements describe common spine-leaf properties?",
      [
        "Leaf switches commonly connect endpoints",
        "Each leaf usually connects to only one spine",
        "A leaf can use multiple spine paths",
        "Spines are normally endpoint access switches",
        "Leaf switches cannot route"
      ],
      [
        0,
        2
      ],
      "Leaves provide endpoint access and commonly connect to multiple spines. A one-spine-only design limits diversity, and spines are not usually endpoint access switches."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "Underlay, Overlay, and Fabric",
  "points": [
    "An underlay is the physical or routed network providing basic IP reachability.",
    "An overlay builds logical connectivity on the underlay, often with encapsulation.",
    "A fabric combines infrastructure and logical services into a managed network."
  ],
  "questions": [
    [
      "What is the main purpose of an IP underlay in an overlay network?",
      [
        "Provide reachability between tunnel endpoints",
        "Encrypt every application automatically",
        "Assign usernames to switches",
        "Replace endpoint addressing"
      ],
      [
        0
      ],
      "The underlay supplies connectivity used by overlay endpoints. It does not automatically encrypt traffic or replace host addressing."
    ],
    [
      "Which description best fits a network overlay?",
      [
        "A cable plant with no logical services",
        "A logical network built over an existing transport",
        "A routing table stored only on a laptop",
        "A replacement for physical switching"
      ],
      [
        1
      ],
      "An overlay provides logical connectivity over an underlay. It does not remove the physical network beneath it."
    ],
    [
      "A VXLAN tunnel carries Ethernet frames over an IP network. What is the IP network?",
      [
        "Northbound API",
        "Management plane",
        "Underlay",
        "Application payload"
      ],
      [
        2
      ],
      "The IP transport carrying encapsulated traffic is the underlay. VXLAN provides an overlay mechanism over it."
    ],
    [
      "Why might an organization use overlays in a data center?",
      [
        "To eliminate physical cabling",
        "To require a separate physical network per tenant",
        "To disable route selection",
        "To provide logical segmentation over shared infrastructure"
      ],
      [
        3
      ],
      "Overlays can provide segmentation while sharing an underlay. They do not eliminate cables or disable routing."
    ],
    [
      "Which two statements about overlays and underlays are correct?",
      [
        "The underlay provides transport reachability",
        "An overlay always works without transport",
        "An overlay can provide logical segmentation",
        "An underlay is always an application API",
        "The underlay is a user-facing portal"
      ],
      [
        0,
        2
      ],
      "An underlay provides transport, and overlays can add services such as segmentation. Overlays depend on transport, and underlays are not application APIs."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "DNA Center Assurance and SD-Access",
  "points": [
    "Assurance correlates telemetry and analytics to help identify network health issues.",
    "Automation supports provisioning and consistent lifecycle operations.",
    "SD-Access uses policy and fabric concepts for segmented campus connectivity."
  ],
  "questions": [
    [
      "What is the main purpose of assurance in Cisco DNA Center?",
      [
        "Analyze telemetry and assess network health",
        "Replace routing protocols",
        "Serve as the only DHCP server",
        "Encrypt every physical link"
      ],
      [
        0
      ],
      "Assurance analyzes collected information to help operators understand performance. It does not replace routing or provide every network service."
    ],
    [
      "Which activity is most closely associated with DNA Center automation?",
      [
        "Manually editing every device separately",
        "Provisioning repeatable network configurations",
        "Replacing switches with virtual machines",
        "Converting Ethernet to radio signals"
      ],
      [
        1
      ],
      "Automation supports repeatable provisioning and lifecycle tasks. It does not replace physical equipment or convert media."
    ],
    [
      "What is a central SD-Access concept?",
      [
        "A physical switch for every user",
        "Removing IP forwarding from campus",
        "Policy and fabric services for segmented campus connectivity",
        "Sending all traffic through the DNA Center server"
      ],
      [
        2
      ],
      "SD-Access uses fabric and policy constructs for scalable segmentation. User traffic is not required to traverse the management server."
    ],
    [
      "Which information is most relevant to assurance analytics for poor client experience?",
      [
        "A switch purchase invoice only",
        "Unused rack-screw inventory",
        "A static diagram without measurements",
        "Collected network and client telemetry"
      ],
      [
        3
      ],
      "Current telemetry helps correlate network conditions with client experience. Static inventory alone may not reveal an active performance problem."
    ],
    [
      "Which two statements accurately describe DNA Center?",
      [
        "It supports centralized automation workflows",
        "It forwards all campus user packets",
        "Assurance can analyze network health",
        "It replaces network devices",
        "It disables monitoring"
      ],
      [
        0,
        2
      ],
      "DNA Center supports automation and assurance. It is a management platform, not the user traffic forwarding device, and does not replace switches."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "REST Resources and HTTP Operations",
  "points": [
    "REST APIs expose resources identified by URIs and use HTTP methods.",
    "GET reads; POST commonly creates or submits; PUT replaces or sets; DELETE removes.",
    "A request body carries structured data, and a response carries status and possibly data."
  ],
  "questions": [
    [
      "Which HTTP method is commonly used to retrieve a resource without changing it?",
      [
        "GET",
        "DELETE",
        "PATCH",
        "POST"
      ],
      [
        0
      ],
      "GET is conventionally used to read a resource. DELETE removes it, while POST and PATCH commonly change data."
    ],
    [
      "A client needs to remove a configuration resource. Which method is conventional?",
      [
        "GET",
        "DELETE",
        "PUT",
        "HEAD"
      ],
      [
        1
      ],
      "DELETE conventionally requests resource removal. GET reads data and PUT updates or replaces it."
    ],
    [
      "What does a URI identify in a REST API?",
      [
        "A router's serial number only",
        "An encryption algorithm for every packet",
        "A resource or endpoint location",
        "An HTTP response code"
      ],
      [
        2
      ],
      "A URI identifies a resource or its location in the API. It is not a response code or packet encryption algorithm."
    ],
    [
      "Which method commonly submits data to create a new resource in a collection?",
      [
        "OPTIONS",
        "GET",
        "TRACE",
        "POST"
      ],
      [
        3
      ],
      "POST commonly submits data to create a resource in a collection or trigger a server operation. GET retrieves resources."
    ],
    [
      "Which two pairs correctly match REST operations to methods?",
      [
        "Read resource — GET",
        "Delete resource — POST only",
        "Remove resource — DELETE",
        "Retrieve resource — PUT",
        "Create resource — GET"
      ],
      [
        0,
        2
      ],
      "GET reads and DELETE removes resources in common REST conventions. PUT usually replaces or sets a resource rather than retrieving it."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "HTTP Headers and Authentication",
  "points": [
    "Headers carry metadata such as content type, accepted format, and authorization.",
    "Basic authentication encodes credentials; HTTPS is needed to protect them in transit.",
    "Bearer tokens and API keys are credentials handled according to each API's scheme."
  ],
  "questions": [
    [
      "Which HTTP header commonly indicates that a request body contains JSON?",
      [
        "Content-Type: application/json",
        "Host: application/json",
        "Status: 200",
        "Method: JSON"
      ],
      [
        0
      ],
      "Content-Type describes the media type of a request body. Host identifies a destination, while status and method are not used this way."
    ],
    [
      "What is an important security consideration for HTTP Basic authentication?",
      [
        "It requires no credentials",
        "Use HTTPS because encoding is not encryption",
        "It works only with XML",
        "It rotates passwords after every request"
      ],
      [
        1
      ],
      "Basic authentication encodes credentials but does not encrypt them. HTTPS protects them in transit."
    ],
    [
      "Where is a bearer token commonly sent in an HTTP request?",
      [
        "In the URL fragment only",
        "In the response status line",
        "In an Authorization header",
        "In a DNS query name"
      ],
      [
        2
      ],
      "A common pattern is an Authorization header with a Bearer scheme. Tokens in URLs can leak through logs."
    ],
    [
      "Which statement about an API key is most accurate?",
      [
        "It is an ARP password",
        "It is automatically safe to expose in a URL",
        "It can only be stored in XML",
        "It is a credential whose handling depends on the API"
      ],
      [
        3
      ],
      "An API key identifies or authorizes a client according to service rules and must be protected. It is not safe to expose publicly."
    ],
    [
      "Which HTTP header commonly carries a bearer token?",
      [
        "Authorization",
        "Content-Type",
        "Accept",
        "Host"
      ],
      [
        0
      ],
      "A bearer token is commonly sent in the Authorization header. Content-Type and Accept describe media types, while Host identifies the destination host."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "HTTP Status Codes and Idempotency",
  "points": [
    "2xx indicates success; 3xx indicates redirection; 4xx indicates a client-side issue.",
    "5xx indicates a server failed to fulfill an apparently valid request.",
    "An idempotent operation has the same intended effect when repeated with the same input."
  ],
  "questions": [
    [
      "What does HTTP 201 commonly indicate?",
      [
        "The client must authenticate again",
        "A resource was created successfully",
        "The server redirected the request",
        "The server encountered an internal error"
      ],
      [
        1
      ],
      "201 Created is a successful response commonly used after creating a resource. Authentication and server failures use other codes."
    ],
    [
      "A client receives HTTP 404 for an API resource. What does this commonly mean?",
      [
        "The server is overloaded",
        "The request redirected successfully",
        "The requested resource was not found",
        "A new resource was created"
      ],
      [
        2
      ],
      "404 Not Found indicates the requested resource could not be found. It is not a server-overload status."
    ],
    [
      "Which HTTP status-code range indicates a server-side error?",
      [
        "2xx",
        "3xx",
        "1xx",
        "5xx"
      ],
      [
        3
      ],
      "5xx indicates server errors. 2xx is success, 3xx redirection, and 1xx informational."
    ],
    [
      "Which status code indicates redirection?",
      [
        "302",
        "200",
        "401",
        "500"
      ],
      [
        0
      ],
      "302 belongs to the 3xx redirection range. 200 is success, 401 is a client error, and 500 is a server error."
    ],
    [
      "Which HTTP status-code family indicates a successful response?",
      [
        "3xx",
        "2xx",
        "4xx",
        "5xx"
      ],
      [
        1
      ],
      "2xx statuses indicate success. 3xx means redirection, 4xx is a client-side error, and 5xx is a server-side error."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "JSON Objects and Arrays",
  "points": [
    "JSON objects contain key-value pairs enclosed in braces; keys are quoted strings.",
    "JSON arrays are ordered lists enclosed in square brackets.",
    "JSON supports strings, numbers, booleans, null, objects, and arrays."
  ],
  "questions": [
    [
      "Given this JSON: {\n  \"enabled\": true,\n  \"name\": \"edge-1\"\n} What does the outer pair of braces represent?",
      [
        "A JSON array",
        "A YAML sequence",
        "A JSON object",
        "An XML element"
      ],
      [
        2
      ],
      "Curly braces delimit a JSON object containing key-value pairs. Arrays use square brackets, while XML uses tags."
    ],
    [
      "Given this JSON: {\n  \"vlans\": [10, 20, 30]\n} What is the value associated with vlans?",
      [
        "A Boolean",
        "A URI",
        "An XML attribute",
        "An array"
      ],
      [
        3
      ],
      "Square brackets define an ordered array of three numbers. The enclosing object associates that array with the vlans key."
    ],
    [
      "Which is a valid JSON Boolean literal?",
      [
        "true",
        "yes",
        "True",
        "enabled"
      ],
      [
        0
      ],
      "JSON Boolean literals are lowercase true and false. Other words are strings only when quoted."
    ],
    [
      "In {\"hostname\": \"sw1\"}, what is hostname?",
      [
        "An array index",
        "A key",
        "A numeric value",
        "A Boolean value"
      ],
      [
        1
      ],
      "hostname is the object's key and sw1 is its string value. JSON object keys are strings."
    ],
    [
      "Given this JSON: {\n  \"site\": \"west\",\n  \"clients\": 12\n} Which value is a number?",
      [
        "west",
        "site",
        "12",
        "clients"
      ],
      [
        2
      ],
      "The value 12 is an unquoted JSON number. west is a string, while site and clients are object keys."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "XML and YAML Data Formats",
  "points": [
    "XML represents data with nested named tags and explicit closing tags.",
    "YAML uses indentation and simple key-value or list syntax.",
    "Both formats represent structured configuration; syntax and indentation must be valid."
  ],
  "questions": [
    [
      "Which format uses elements such as <hostname>sw1</hostname>?",
      [
        "YAML",
        "CSV",
        "HTTP status",
        "XML"
      ],
      [
        3
      ],
      "Paired opening and closing tags are XML elements. YAML generally uses indentation and key-value notation."
    ],
    [
      "What is especially important for nested YAML structures?",
      [
        "Consistent indentation",
        "Matching angle-bracket tags",
        "A semicolon after every line",
        "Values in URL fragments"
      ],
      [
        0
      ],
      "YAML uses indentation to express hierarchy, so inconsistent indentation can change or invalidate structure."
    ],
    [
      "Which YAML snippet represents key site with value east?",
      [
        "<site>east</site>",
        "site: east",
        "site[east]",
        "site = [east]"
      ],
      [
        1
      ],
      "The key-colon-value form is common YAML syntax. The other forms resemble XML or nonstandard notation."
    ],
    [
      "Which format is naturally written with opening and closing tags?",
      [
        "JSON",
        "YAML",
        "XML",
        "CSV"
      ],
      [
        2
      ],
      "XML uses named opening and closing tags. JSON uses braces and brackets, while YAML uses indentation."
    ],
    [
      "Which format commonly uses indentation to indicate hierarchy?",
      [
        "XML",
        "HTTP",
        "CSV",
        "YAML"
      ],
      [
        3
      ],
      "YAML commonly shows hierarchy through indentation. XML uses nested tags, and HTTP and CSV are not hierarchical configuration formats by default."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "Configuration Management Tools",
  "points": [
    "Ansible commonly uses agentless SSH or WinRM connections and playbooks.",
    "Puppet and Chef commonly use agents to apply managed configuration.",
    "Terraform primarily defines and provisions infrastructure resources."
  ],
  "questions": [
    [
      "Which tool is commonly known for agentless configuration management using SSH?",
      [
        "Ansible",
        "Puppet",
        "Chef",
        "Terraform"
      ],
      [
        0
      ],
      "Ansible commonly connects over SSH without a persistent agent. Puppet and Chef often use agents; Terraform focuses on provisioning infrastructure."
    ],
    [
      "Which tool is primarily associated with provisioning infrastructure from declarative files?",
      [
        "Syslog",
        "Terraform",
        "TFTP",
        "NTP"
      ],
      [
        1
      ],
      "Terraform declares infrastructure resources and works with providers to create or update them. The other choices are network services."
    ],
    [
      "Which tools commonly use agents on managed nodes?",
      [
        "Ansible and Terraform",
        "NETCONF and RESTCONF",
        "Puppet and Chef",
        "OpenFlow and HTTP"
      ],
      [
        2
      ],
      "Puppet and Chef commonly use agents to apply configuration. Ansible is typically agentless; the others are protocols or API technologies."
    ],
    [
      "What is a common purpose of an Ansible playbook?",
      [
        "Replace a device bootloader",
        "Reserve public addresses without a provider",
        "Encode packets as Ethernet frames",
        "Define repeatable automation tasks"
      ],
      [
        3
      ],
      "A playbook describes tasks Ansible executes against selected hosts. It does not replace firmware or define packet framing."
    ],
    [
      "Which tool commonly connects to managed Linux hosts over SSH without a persistent agent?",
      [
        "Ansible",
        "Chef",
        "Puppet",
        "Terraform"
      ],
      [
        0
      ],
      "Ansible commonly uses SSH for agentless management. Puppet and Chef commonly use agents, while Terraform provisions infrastructure resources."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "Declarative and Procedural Automation",
  "points": [
    "Declarative automation describes the desired end state or outcome.",
    "Procedural automation specifies the sequence of actions to execute.",
    "A tool may compare current state with desired state and apply necessary changes."
  ],
  "questions": [
    [
      "Which statement best describes a declarative configuration?",
      [
        "It lists every CLI keystroke in order",
        "It describes the desired end state",
        "It contains only alarms",
        "It prevents checking current state"
      ],
      [
        1
      ],
      "Declarative configuration states the intended result. Procedural automation more explicitly specifies how to perform each step."
    ],
    [
      "A script says enter config mode, create a VLAN, then assign a port. What style is this?",
      [
        "Declarative",
        "Predictive",
        "Procedural",
        "Model-free"
      ],
      [
        2
      ],
      "The script specifies an ordered sequence of actions, which is procedural. Declarative instructions emphasize the intended final state."
    ],
    [
      "What is one advantage of comparing actual state with desired state?",
      [
        "It must resend every command continuously",
        "It cannot detect drift",
        "It removes the need to define intent",
        "It can determine needed changes to reach the target"
      ],
      [
        3
      ],
      "Comparing states helps identify and apply required changes. A declarative system still needs an intended target."
    ],
    [
      "Which instruction is most declarative?",
      [
        "Ensure Gi0/1 is enabled and assigned to VLAN 20",
        "Run command A, wait, then command B",
        "Open a terminal and type five lines",
        "Reboot after setting an interface"
      ],
      [
        0
      ],
      "This instruction describes the desired interface condition. The alternatives prescribe action sequences."
    ],
    [
      "A tool receives a target configuration and reconciles devices to match it. Which style is this?",
      [
        "Procedural",
        "Declarative",
        "Manual-only",
        "Transport-level"
      ],
      [
        1
      ],
      "A target configuration describes the desired state, so reconciliation is declarative. Procedural automation lists steps to reach the state."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "Push and Pull Management Models",
  "points": [
    "In a push model, a central system initiates delivery of configuration.",
    "In a pull model, managed devices or agents retrieve policy or updates.",
    "Push/pull describes update initiation and is separate from declarative or procedural style."
  ],
  "questions": [
    [
      "In a push configuration model, which system typically initiates delivery?",
      [
        "The endpoint DNS resolver",
        "The switch data plane",
        "The central management system",
        "A browser cache"
      ],
      [
        2
      ],
      "In push, the management system initiates sending configuration. The data plane forwards traffic but does not originate policy."
    ],
    [
      "A node periodically contacts a server to retrieve its assigned configuration. Which model is this?",
      [
        "Push",
        "Flooding",
        "Store-and-forward",
        "Pull"
      ],
      [
        3
      ],
      "The managed node initiates retrieval, which is a pull model. In push, the central system initiates delivery."
    ],
    [
      "What do push and pull describe?",
      [
        "Which side initiates an update",
        "Whether data uses JSON",
        "Whether a tool is declarative",
        "Whether management is encrypted"
      ],
      [
        0
      ],
      "Push and pull describe which side initiates updates. They do not specify data format or declarative style."
    ],
    [
      "Why might an organization choose a pull-based agent model?",
      [
        "It requires inbound sessions to every node",
        "Nodes can initiate periodic check-ins to retrieve updates",
        "It eliminates authentication",
        "It prevents devices from checking in"
      ],
      [
        1
      ],
      "A pull agent can initiate check-ins, which can suit environments restricting inbound management connections. Authentication remains necessary."
    ],
    [
      "A management server sends policy changes to devices without waiting for device requests. Which model is being used?",
      [
        "Pull",
        "Peer discovery",
        "Push",
        "Polling by the device"
      ],
      [
        2
      ],
      "The server initiates delivery, so this is push. Pull would have nodes initiate retrieval or check-ins."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "AI and Machine Learning Operations",
  "points": [
    "Machine learning can detect patterns and anomalies in network telemetry.",
    "Predictive analytics estimates likely future conditions from observed data.",
    "Generative AI creates or summarizes content, which should be reviewed before use."
  ],
  "questions": [
    [
      "Which task is an example of predictive analytics in network operations?",
      [
        "Writing a fictional incident report",
        "Physically replacing a power supply",
        "Changing routes without review",
        "Estimating link failure likelihood from trends"
      ],
      [
        3
      ],
      "Predictive analytics uses patterns to estimate future events such as failure risk. It does not repair hardware or justify unchecked changes."
    ],
    [
      "What is a common use of generative AI for network operators?",
      [
        "Drafting a configuration explanation or troubleshooting summary",
        "Measuring optical power without a sensor",
        "Replacing a router data plane",
        "Guaranteeing every generated command is safe"
      ],
      [
        0
      ],
      "Generative AI can draft summaries or explanations. Output needs verification and cannot guarantee command safety."
    ],
    [
      "A system flags traffic that differs from a learned baseline. What capability is used?",
      [
        "Static routing",
        "Machine-learning anomaly detection",
        "Address translation",
        "Physical-layer encoding"
      ],
      [
        1
      ],
      "Comparing observed behavior to a learned baseline is anomaly detection. The other choices are unrelated network functions."
    ],
    [
      "Why should engineers review AI-generated configuration before applying it?",
      [
        "AI output is always encrypted",
        "Generated content cannot contain syntax",
        "Output may be inaccurate or unsuitable for the environment",
        "Review prevents telemetry collection"
      ],
      [
        2
      ],
      "Generated recommendations can be incomplete or wrong and must be validated against policy and device context."
    ],
    [
      "Which statement describes predictive analytics rather than generative AI?",
      [
        "Drafting a plain-language outage summary",
        "Generating an example JSON configuration",
        "Writing a troubleshooting checklist",
        "Estimating a likely future congestion event from telemetry"
      ],
      [
        3
      ],
      "Estimating a future event from telemetry is predictive analytics. Drafting summaries, examples, and checklists is generative work."
    ]
  ]
},
{
  "domain": "automation-programmability",
  "title": "Automation Safety and Validation",
  "points": [
    "Test automation in a representative environment before broad deployment.",
    "Change controls, backups, and rollback plans reduce operational risk.",
    "Logs and post-change checks help verify that the intended outcome occurred."
  ],
  "questions": [
    [
      "Before running a new automation across a campus, what is a sensible first step?",
      [
        "Test on a limited representative set of devices",
        "Disable all monitoring permanently",
        "Remove the rollback plan",
        "Run it everywhere without review"
      ],
      [
        0
      ],
      "A limited representative test can reveal errors while containing impact. Removing monitoring and rollback increases risk."
    ],
    [
      "What is the purpose of a rollback plan for an automated change?",
      [
        "Ensure changes are never approved",
        "Restore a known working state if the change causes problems",
        "Convert JSON into XML",
        "Guarantee the controller cannot fail"
      ],
      [
        1
      ],
      "A rollback plan provides a recovery path if deployment has an adverse effect. It does not prevent approval or guarantee availability."
    ],
    [
      "Why verify results after an automated change?",
      [
        "Automation always reports false success",
        "An API cannot return a status code",
        "To confirm the network reached the intended condition",
        "To avoid documenting the change"
      ],
      [
        2
      ],
      "Post-change validation checks actual outcome against intent. An API response alone may not prove end-to-end service health."
    ],
    [
      "Which practice gives useful evidence about what an automation run changed?",
      [
        "Deleting logs immediately",
        "Changing credentials without a record",
        "Using untracked manual edits",
        "Keeping execution logs and change records"
      ],
      [
        3
      ],
      "Logs and records support auditability and troubleshooting. Deleting logs makes outcomes harder to understand."
    ],
    [
      "Which action best limits risk when rolling out a new automation to production?",
      [
        "Deploy gradually with checks between stages",
        "Skip review and execute on every device",
        "Disable rollback protection",
        "Ignore failed status responses"
      ],
      [
        0
      ],
      "A staged rollout with checks limits blast radius and reveals problems early. Skipping review or ignoring failures increases operational risk."
    ]
  ]
}
);
