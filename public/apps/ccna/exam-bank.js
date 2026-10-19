// Exam-only questions: hand-built multiple choice, drag-and-drop and the CLI labs.
// More exam questions live in exam-<domain>.js (examPool). Types: mc (default), dnd, lab.
const mc = (id, domain, question, options, answer, explanation) => ({ id, domain, examOnly: true, question, options, answer, explanation });

examBank.push(
  /* Network Fundamentals */
  mc("x-nf-1", "network-fundamentals", "Which OSI layer provides end-to-end delivery, segmentation, and error recovery between hosts?", ["Network", "Transport", "Session", "Data link"], [1], "The transport layer (TCP/UDP) handles segmentation and end-to-end delivery. TCP adds reliability and error recovery."),
  mc("x-nf-2", "network-fundamentals", "Which connection has traditionally required a crossover cable when auto-MDIX is not available?", ["PC to switch", "Router to switch", "Switch to switch", "Server to switch"], [2], "Like devices (switch to switch, PC to PC, router to router) transmit and receive on the same pairs, so a crossover cable was needed. Modern ports use auto-MDIX."),
  mc("x-nf-3", "network-fundamentals", "A switch receives a frame whose destination MAC address is not in its MAC address table. What does it do?", ["Drops the frame", "Floods it out every port except the one it arrived on", "Sends it only to the default gateway", "Sends an ARP reply"], [1], "Unknown unicast frames are flooded out all ports in the VLAN except the ingress port."),
  mc("x-nf-4", "network-fundamentals", "Which is a valid compressed form of 2001:0DB8:0000:0000:0000:0000:0000:0001?", ["2001:DB8::1", "2001::DB8::1", "2001:DB8:0:1", "2001:DB8::0001::"], [0], "Leading zeros can be dropped and one run of all-zero groups replaced by '::'. '::' may appear only once."),
  mc("x-nf-5", "network-fundamentals", "Which traffic type does IPv6 not use?", ["Unicast", "Multicast", "Anycast", "Broadcast"], [3], "IPv6 replaced broadcast with multicast. It uses unicast, multicast, and anycast."),
  mc("x-nf-6", "network-fundamentals", "How many usable host addresses are in a /26 subnet?", ["30", "62", "64", "126"], [1], "A /26 leaves 6 host bits: 2^6 = 64 addresses, minus the network and broadcast addresses = 62."),
  mc("x-nf-7", "network-fundamentals", "Which address is a private RFC 1918 address?", ["172.32.4.9", "192.169.1.10", "172.20.5.9", "11.1.1.1"], [2], "RFC 1918 ranges are 10.0.0.0/8, 172.16.0.0/12 (172.16–172.31), and 192.168.0.0/16. 172.20.5.9 falls in the middle one."),
  mc("x-nf-8", "network-fundamentals", "An interface shows steadily increasing CRC errors. What is the most likely cause?", ["Wrong default gateway", "A faulty cable or electrical interference", "A missing VLAN", "A duplicate hostname"], [1], "CRC errors mean frames arrive corrupted, which points to a physical problem such as bad cabling, a bad connector, or interference."),
  mc("x-nf-9", "network-fundamentals", "Which transport protocol is connectionless and does not guarantee delivery?", ["TCP", "UDP", "ICMP", "ARP"], [1], "UDP is connectionless and best-effort with low overhead. It is used by DNS queries, VoIP, and streaming."),
  mc("x-nf-10", "network-fundamentals", "What is the correct order of the TCP three-way handshake?", ["SYN, SYN-ACK, ACK", "SYN, ACK, SYN-ACK", "ACK, SYN, SYN-ACK", "SYN-ACK, SYN, ACK"], [0], "The client sends SYN, the server replies SYN-ACK, and the client completes with ACK."),
  {
    id: "x-nf-11", domain: "network-fundamentals", examOnly: true, type: "dnd",
    question: "Match each well-known service to its default port number.",
    pairs: [["SSH", "TCP 22"], ["Telnet", "TCP 23"], ["DNS", "UDP/TCP 53"], ["HTTPS", "TCP 443"]],
    explanation: "SSH uses 22, Telnet 23, DNS 53, and HTTPS 443. Memorising these common ports is worth it for the exam."
  },
  {
    id: "x-nf-12", domain: "network-fundamentals", examOnly: true, type: "dnd",
    question: "Match each OSI layer to the data unit (PDU) it uses.",
    pairs: [["Layer 1 – Physical", "Bits"], ["Layer 2 – Data link", "Frames"], ["Layer 3 – Network", "Packets"], ["Layer 4 – Transport", "Segments"]],
    explanation: "Physical moves bits, data link uses frames, network uses packets, and transport uses segments (TCP) or datagrams (UDP)."
  },

  /* Network Access */
  mc("x-na-1", "network-access", "Which command shows each VLAN and the access ports assigned to it?", ["show vlan brief", "show interfaces trunk", "show ip route", "show mac address-table"], [0], "show vlan brief lists VLAN IDs, names, status, and the access ports in each VLAN."),
  mc("x-na-2", "network-access", "What is the default native VLAN on a Cisco switch trunk?", ["0", "1", "99", "1005"], [1], "VLAN 1 is the default native VLAN. Best practice is to change it to an unused VLAN."),
  mc("x-na-3", "network-access", "What is router-on-a-stick?", ["A router with one subinterface per VLAN on a single trunk link", "Two routers sharing a virtual IP", "A switch with a routed port per VLAN", "A wireless controller feature"], [0], "Router-on-a-stick routes between VLANs using subinterfaces on one physical interface connected to a trunk."),
  mc("x-na-4", "network-access", "Which subinterface command associates it with VLAN 20?", ["switchport access vlan 20", "encapsulation dot1q 20", "vlan 20 tag", "trunk allowed vlan 20"], [1], "On a router subinterface, 'encapsulation dot1q 20' tells it to handle 802.1Q frames tagged with VLAN 20."),
  mc("x-na-5", "network-access", "How does Spanning Tree Protocol choose the root bridge?", ["Highest MAC address", "Lowest bridge ID (priority, then MAC address)", "Highest port speed", "Lowest IP address"], [1], "The switch with the lowest bridge ID wins. The ID is the priority value followed by the MAC address as a tie-breaker."),
  mc("x-na-6", "network-access", "Which protocol is the IEEE standard for bundling physical links into an EtherChannel?", ["LACP", "PAgP", "VTP", "DTP"], [0], "LACP (802.3ad/802.1AX) is the open standard. PAgP is Cisco proprietary."),
  mc("x-na-7", "network-access", "How are lightweight access points managed?", ["Individually through their console ports", "By a WLC using CAPWAP tunnels", "By SNMP only", "By each wireless client"], [1], "Lightweight APs build CAPWAP tunnels to a wireless LAN controller, which handles configuration and management."),
  mc("x-na-8", "network-access", "What does PortFast do on an access port?", ["Encrypts the port", "Moves the port straight to forwarding, skipping listening and learning", "Doubles the port speed", "Blocks BPDUs from the root"], [1], "PortFast lets edge ports connected to hosts start forwarding immediately instead of waiting for STP convergence."),
  mc("x-na-9", "network-access", "Which statement about LLDP versus CDP is true?", ["LLDP is Cisco proprietary", "CDP is an open standard", "LLDP is a vendor-neutral standard", "They cannot run on the same device"], [2], "LLDP (802.1AB) is the vendor-neutral discovery protocol. CDP is Cisco proprietary. Both can run on one device."),
  mc("x-na-10", "network-access", "Which two 2.4 GHz channels do not overlap with each other?", ["Channel 1", "Channel 2", "Channel 3", "Channel 6"], [0, 3], "Channels must be at least five apart to avoid overlap. Of these options, only 1 and 6 qualify (1, 6, and 11 is the usual plan)."),
  {
    id: "x-na-11", domain: "network-access", examOnly: true, type: "dnd",
    question: "Match each Spanning Tree port role to its description.",
    pairs: [["Root port", "Best path toward the root bridge"], ["Designated port", "Forwards traffic toward a segment away from the root"], ["Alternate port", "Backup path to the root that is blocking"]],
    explanation: "Each non-root switch has one root port. Designated ports forward on each segment. Alternate ports block and take over if the root port fails."
  },
  {
    id: "x-na-12", domain: "network-access", examOnly: true, type: "lab",
    question: "Lab: Create a VLAN and assign an access port on SW1.",
    lab: {
      device: { hostname: "SW1", kind: "switch", interfaces: Array.from({ length: 24 }, (_, i) => `gigabitethernet0/${i + 1}`) },
      scenario: "A new sales PC is plugged into GigabitEthernet0/5 on SW1. The console is open in user EXEC mode.",
      topology: "[Sales PC] ---- Gi0/5 [ SW1 ]",
      objectives: [
        { text: "Create VLAN 20 and name it SALES", ctx: "vlan 20", cmd: "^name sales$" },
        { text: "Make GigabitEthernet0/5 an access port", ctx: "interface gigabitethernet0/5", cmd: "^switchport mode access$" },
        { text: "Assign GigabitEthernet0/5 to VLAN 20", ctx: "interface gigabitethernet0/5", cmd: "^switchport access vlan 20$" }
      ],
      solution: ["enable", "configure terminal", "vlan 20", "name SALES", "exit", "interface gigabitethernet0/5", "switchport mode access", "switchport access vlan 20", "end"]
    },
    explanation: "Create the VLAN and name it in VLAN configuration mode, then on the interface set the port to access mode and assign it to the VLAN."
  },

  /* IP Connectivity */
  mc("x-ip-1", "ip-connectivity", "A router has routes to 10.1.0.0/16, 10.1.1.0/24, and 10.0.0.0/8. A packet is destined for 10.1.1.50. Which route is used?", ["10.0.0.0/8", "10.1.0.0/16", "10.1.1.0/24", "Whichever has the lowest AD regardless of prefix length"], [2], "The longest prefix match wins. /24 is the most specific route that contains 10.1.1.50."),
  mc("x-ip-2", "ip-connectivity", "What is the default administrative distance of OSPF?", ["90", "100", "110", "120"], [2], "OSPF is 110, EIGRP internal is 90, and RIP is 120."),
  mc("x-ip-3", "ip-connectivity", "Which command configures an IPv4 default route via 192.0.2.1?", ["ip route 0.0.0.0 0.0.0.0 192.0.2.1", "ip default-route 192.0.2.1", "ip route default 192.0.2.1", "ip gateway 192.0.2.1"], [0], "A default route uses network 0.0.0.0 and mask 0.0.0.0 followed by the next hop."),
  mc("x-ip-4", "ip-connectivity", "Which OSPF neighbor state means the neighbors' databases are fully synchronized?", ["Init", "2-Way", "Exchange", "Full"], [3], "Neighbors reach Full after exchanging and loading link-state information."),
  mc("x-ip-5", "ip-connectivity", "On which network type does OSPF elect a DR and BDR?", ["Point-to-point serial", "Multi-access Ethernet", "Loopback", "Tunnel"], [1], "A DR and BDR are elected on multi-access broadcast networks such as Ethernet to reduce adjacencies."),
  mc("x-ip-6", "ip-connectivity", "If no router-id command is configured, how does an OSPF router choose its router ID?", ["Highest active loopback IP, otherwise highest active interface IP", "Lowest interface IP", "Lowest MAC address", "A random value"], [0], "Order of preference: manual router-id, highest loopback IPv4 address, then highest IPv4 address on an active physical interface."),
  mc("x-ip-7", "ip-connectivity", "Which command displays the IPv4 routing table?", ["show ip route", "show routes", "show ip interface", "show running-config route"], [0], "show ip route lists learned, static, and connected routes with their codes."),
  mc("x-ip-8", "ip-connectivity", "What does the code C mean next to a route in show ip route?", ["Configured static", "Directly connected network", "Cached", "Connectionless"], [1], "C is a directly connected network. L is the local address of an interface."),
  mc("x-ip-9", "ip-connectivity", "What is a floating static route?", ["A static route with a higher AD than a dynamic route, used only as a backup", "A route that changes next hop automatically", "A route learned through DHCP", "A route with the lowest metric"], [0], "Raising the AD of a static route above that of a dynamic protocol keeps it out of the table until the dynamic route disappears."),
  mc("x-ip-10", "ip-connectivity", "Which metric does OSPF use to choose the best path?", ["Hop count", "Cost based on bandwidth", "Delay and load", "Administrative distance"], [1], "OSPF cost is derived from interface bandwidth. The path with the lowest total cost wins."),
  mc("x-ip-11", "ip-connectivity", "The same prefix is learned from a static route, EIGRP, OSPF, and RIP. Which is installed in the routing table?", ["Static route", "EIGRP", "OSPF", "RIP"], [0], "The lowest administrative distance wins: static 1, EIGRP 90, OSPF 110, RIP 120."),
  mc("x-ip-12", "ip-connectivity", "Which command configures an IPv6 default route to 2001:db8::1?", ["ipv6 route ::/0 2001:db8::1", "ip route ::/0 2001:db8::1", "ipv6 default 2001:db8::1", "ipv6 route 0.0.0.0/0 2001:db8::1"], [0], "The IPv6 default route is ::/0 and is configured with ipv6 route."),
  mc("x-ip-13", "ip-connectivity", "What does HSRP provide?", ["A virtual gateway IP address for first-hop redundancy", "Dynamic routing", "Link aggregation", "Port security"], [0], "HSRP lets two or more routers share a virtual IP and MAC so hosts keep a working default gateway if one router fails."),
  mc("x-ip-14", "ip-connectivity", "Which summary route covers 192.168.0.0/24 through 192.168.3.0/24?", ["192.168.0.0/23", "192.168.0.0/22", "192.168.0.0/21", "192.168.0.0/16"], [1], "Four consecutive /24 networks summarize to a /22 (2 extra bits), which covers 192.168.0.0 to 192.168.3.255."),
  mc("x-ip-15", "ip-connectivity", "A router receives a packet with no matching route and no default route. What happens?", ["It floods the packet", "It drops the packet and may send an ICMP destination unreachable", "It forwards it out the first interface", "It queues it until a route appears"], [1], "With no match the router discards the packet and usually sends ICMP destination unreachable to the source."),
  {
    id: "x-ip-16", domain: "ip-connectivity", examOnly: true, type: "dnd",
    question: "Match each route source to its default administrative distance.",
    pairs: [["Connected", "0"], ["Static", "1"], ["EIGRP (internal)", "90"], ["OSPF", "110"], ["RIP", "120"]],
    explanation: "Lower is more trusted: connected 0, static 1, EIGRP 90, OSPF 110, RIP 120."
  },
  {
    id: "x-ip-17", domain: "ip-connectivity", examOnly: true, type: "lab",
    question: "Lab: Configure an interface and a static route on R1.",
    lab: {
      device: { hostname: "R1", kind: "router", interfaces: ["gigabitethernet0/0", "gigabitethernet0/1"] },
      scenario: "R1 connects to a neighbor router (10.1.1.2) on GigabitEthernet0/0. A remote network, 192.168.50.0/24, sits behind that neighbor. The console is in user EXEC mode.",
      topology: "[ R1 ] Gi0/0 ---- 10.1.1.0/24 ---- [ R2 10.1.1.2 ] ---- 192.168.50.0/24",
      objectives: [
        { text: "Set the IP address of GigabitEthernet0/0 to 10.1.1.1 with mask 255.255.255.0", ctx: "interface gigabitethernet0/0", cmd: "^ip address 10\\.1\\.1\\.1 255\\.255\\.255\\.0$" },
        { text: "Enable the interface", ctx: "interface gigabitethernet0/0", cmd: "^no shutdown$" },
        { text: "Add a static route to 192.168.50.0/24 via 10.1.1.2", ctx: "", cmd: "^ip route 192\\.168\\.50\\.0 255\\.255\\.255\\.0 10\\.1\\.1\\.2$" }
      ],
      solution: ["enable", "configure terminal", "interface gigabitethernet0/0", "ip address 10.1.1.1 255.255.255.0", "no shutdown", "exit", "ip route 192.168.50.0 255.255.255.0 10.1.1.2", "end"]
    },
    explanation: "Router interfaces start shut down, so you need no shutdown. The static route uses the network, its mask, and the next-hop address."
  },

  /* IP Services */
  mc("x-is-1", "ip-services", "Which NAT type maps many private addresses to a single public address using unique port numbers?", ["Static NAT", "Dynamic NAT", "PAT (NAT overload)", "NAT64"], [2], "PAT (overload) tracks each translation with a unique source port so many hosts can share one public IP."),
  {
    id: "x-is-2", domain: "ip-services", examOnly: true, type: "dnd",
    question: "Match each IP service to its function.",
    pairs: [["DHCP", "Assigns IP settings to hosts automatically"], ["DNS", "Resolves names to IP addresses"], ["NTP", "Synchronizes device clocks"], ["Syslog", "Collects log messages from devices"]],
    explanation: "DHCP hands out addresses, DNS resolves names, NTP keeps clocks in sync (important for logs), and syslog centralizes messages."
  },

  /* Security Fundamentals */
  mc("x-sf-1", "security-fundamentals", "Which port security violation mode places the port into the err-disabled state?", ["protect", "restrict", "shutdown", "monitor"], [2], "Shutdown is the default mode. It err-disables the port. Protect and restrict drop offending frames, and restrict also logs them."),
  mc("x-sf-2", "security-fundamentals", "Which global command encrypts plaintext passwords in the configuration?", ["enable secret", "service password-encryption", "login local", "password encrypt"], [1], "service password-encryption applies weak type 7 encryption to plaintext passwords such as those on line interfaces."),
  mc("x-sf-3", "security-fundamentals", "Which protocol should replace Telnet for secure remote CLI access?", ["TFTP", "SSH", "SNMPv1", "HTTP"], [1], "SSH encrypts the session. Telnet sends credentials in clear text."),
  mc("x-sf-4", "security-fundamentals", "What does every ACL end with implicitly?", ["permit any", "deny any", "log", "nothing"], [1], "Every ACL has an invisible deny any at the end, so at least one permit is needed to allow traffic."),
  mc("x-sf-5", "security-fundamentals", "Where should an extended ACL generally be placed?", ["Close to the destination", "Close to the source", "On the core router only", "On loopbacks"], [1], "Extended ACLs match on source, destination, and ports, so place them near the source to drop unwanted traffic early. Standard ACLs go near the destination."),
  {
    id: "x-sf-6", domain: "security-fundamentals", examOnly: true, type: "dnd",
    question: "Match each security term to its meaning.",
    pairs: [["Authentication", "Verifies who the user is"], ["Authorization", "Determines what the user may do"], ["Accounting", "Records what the user did"], ["Port security", "Limits the MAC addresses allowed on a switch port"]],
    explanation: "AAA is authentication, authorization, and accounting. Port security is a separate Layer 2 feature that limits MAC addresses per port."
  },
  {
    id: "x-sf-7", domain: "security-fundamentals", examOnly: true, type: "lab",
    question: "Lab: Secure remote access on R1 with SSH.",
    lab: {
      device: { hostname: "R1", kind: "router", interfaces: ["gigabitethernet0/0", "gigabitethernet0/1"] },
      scenario: "Management wants R1 reachable only by SSH using a local account. Use the domain name lab.local. The console is in user EXEC mode.",
      topology: "[ Admin PC ] ---- [ R1 ]",
      objectives: [
        { text: "Set the domain name to lab.local", ctx: "", cmd: "^ip domain-name lab\\.local$" },
        { text: "Create a local user admin with a secret", ctx: "", cmd: "^username admin secret \\S+$" },
        { text: "Generate RSA keys", ctx: "", cmd: "^crypto key generate rsa" },
        { text: "Use SSH version 2", ctx: "", cmd: "^ip ssh version 2$" },
        { text: "On VTY lines 0 4, allow only SSH", ctx: "line vty 0 4", cmd: "^transport input ssh$" },
        { text: "On VTY lines 0 4, log in with the local database", ctx: "line vty 0 4", cmd: "^login local$" }
      ],
      solution: ["enable", "configure terminal", "ip domain-name lab.local", "username admin secret Cisco123", "crypto key generate rsa modulus 2048", "ip ssh version 2", "line vty 0 4", "transport input ssh", "login local", "end"]
    },
    explanation: "SSH needs a hostname and domain name for key generation, RSA keys, a local user, and VTY lines set to accept only SSH and authenticate against the local database."
  },

  /* Automation and Programmability */
  mc("x-ap-1", "automation-programmability", "Which protocol or interface is a southbound API used by an SDN controller to program network devices?", ["OpenFlow", "HTTP GET", "JSON", "YAML"], [0], "Southbound interfaces such as OpenFlow, NETCONF, and RESTCONF let the controller configure devices. JSON and YAML are data formats."),
  {
    id: "x-ap-2", domain: "automation-programmability", examOnly: true, type: "dnd",
    question: "Match each HTTP method to the CRUD operation it usually performs in a REST API.",
    pairs: [["GET", "Read a resource"], ["POST", "Create a resource"], ["PUT", "Update or replace a resource"], ["DELETE", "Remove a resource"]],
    explanation: "REST maps CRUD onto HTTP: GET reads, POST creates, PUT/PATCH update, DELETE removes."
  }
);
