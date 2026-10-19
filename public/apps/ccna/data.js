// All study content lives here. Edit this file to change modules, lessons, or questions.
//
// Question format:
//   id, domain (module id), question, options[], answer[] (indexes of correct options;
//   more than one = "choose N"), explanation, lesson { title, points[], code?, tip? }

const modules = [
  {
    id: "network-fundamentals",
    title: "Network Fundamentals",
    short: "Fundamentals",
    weight: "20% of exam",
    weightPct: 20,
    duration: "4 lessons · ~2 hrs",
    description: "Get comfortable with how networks are built, how devices communicate, and the models that make it all make sense.",
    lesson: "Networks use layers to break communication into manageable jobs. Ethernet and MAC addresses deliver frames on a local link; IP addresses and routers move packets between networks. A subnet mask separates the network portion of an IPv4 address from its host portion.",
    topics: ["OSI and TCP/IP models", "Ethernet, cabling, and interface errors", "IPv4 addressing and subnetting", "IPv6 address types and notation"]
  },
  {
    id: "network-access",
    title: "Network Access",
    short: "Access",
    weight: "20% of exam",
    weightPct: 20,
    duration: "4 lessons · ~2 hrs",
    description: "Learn how switches connect users to the network, segment traffic, and provide resilient Layer 2 connectivity.",
    lesson: "A VLAN creates its own Layer 2 broadcast domain. Access ports connect end devices to one VLAN, while 802.1Q trunks carry multiple VLANs between network devices. Inter-VLAN communication needs a Layer 3 device, and STP prevents switching loops.",
    topics: ["VLANs, access ports, and trunks", "Inter-VLAN routing", "Spanning Tree Protocol", "EtherChannel and wireless fundamentals"]
  },
  {
    id: "ip-connectivity",
    title: "IP Connectivity",
    short: "Connectivity",
    weight: "25% of exam",
    weightPct: 25,
    duration: "5 lessons · ~3 hrs",
    description: "Understand how routers select paths and configure the routing protocols and services that move packets between networks.",
    lesson: "Routers compare a destination IP against their routing table and choose the most specific matching prefix. Routes can be configured statically or learned dynamically; OSPF shares routes between routers using link-state information.",
    topics: ["Routing tables and longest-prefix match", "Static routes and default routes", "OSPFv2 single-area fundamentals", "First-hop redundancy and gateway behavior"]
  },
  {
    id: "ip-services",
    title: "IP Services",
    short: "Services",
    weight: "10% of exam",
    weightPct: 10,
    duration: "3 lessons · ~1.5 hrs",
    description: "Explore the everyday services that keep a network usable, observable, and secure.",
    lesson: "DHCP assigns host configuration, DNS maps names to addresses, and NTP synchronizes clocks. NAT translates addresses between networks, while syslog and SNMP help operators monitor network devices.",
    topics: ["NAT and PAT", "DHCP, DNS, and NTP", "SNMP, syslog, and QoS concepts", "Secure remote access with SSH"]
  },
  {
    id: "security-fundamentals",
    title: "Security Fundamentals",
    short: "Security",
    weight: "15% of exam",
    weightPct: 15,
    duration: "3 lessons · ~1.5 hrs",
    description: "Build a foundation in device hardening, access control, and the security concepts tested on the CCNA.",
    lesson: "Use defense in depth: harden management access, apply least privilege, and limit traffic with access control lists. ACL entries are evaluated in order, and an implicit deny at the end means permitted traffic must be explicitly matched.",
    topics: ["Threats, vulnerabilities, and mitigation", "Device access control and password security", "ACL purpose and behavior", "Layer 2 security concepts"]
  },
  {
    id: "automation-programmability",
    title: "Automation & Programmability",
    short: "Automation",
    weight: "10% of exam",
    weightPct: 10,
    duration: "2 lessons · ~1 hr",
    description: "See how APIs, controllers, and configuration tools are changing the way networks are managed.",
    lesson: "Controller-based networking centralizes parts of the control plane and exposes APIs for automation. REST APIs commonly use HTTP methods to act on resources, and JSON is a widely used format for exchanging structured data.",
    topics: ["Traditional versus controller-based networks", "REST APIs and HTTP verbs", "JSON data structures", "Configuration management with Ansible and Terraform"]
  }
];

const questionBank = [
  // ───────────── Network Fundamentals ─────────────
  {
    id: "nf-1", domain: "network-fundamentals",
    question: "A host has the address 192.168.10.34/27. Which address is its subnet's network address?",
    options: ["192.168.10.0", "192.168.10.32", "192.168.10.34", "192.168.10.64"],
    answer: [1],
    explanation: "A /27 has blocks of 32 addresses. The range 192.168.10.32–63 starts at network address 192.168.10.32, so .32 is the network address and .63 is the broadcast.",
    lesson: {
      title: "Finding the network address",
      points: [
        "A /27 mask is 255.255.255.224, so the block size is 256 − 224 = 32.",
        "Subnets start at multiples of the block size: .0, .32, .64, .96 …",
        "Find the multiple at or below the host address. .34 sits in the .32 block, so the network is .32 and the broadcast is .63."
      ],
      tip: "Block size = 256 − the “interesting” octet of the mask."
    }
  },
  {
    id: "nf-2", domain: "network-fundamentals",
    question: "How many usable host addresses are available in a /26 IPv4 subnet?",
    options: ["30", "62", "64", "126"],
    answer: [1],
    explanation: "A /26 leaves 6 host bits, so 2^6 = 64 addresses. Subtract the network and broadcast addresses and 62 are usable.",
    lesson: {
      title: "Counting usable hosts",
      points: [
        "Host bits = 32 − prefix length (a /26 has 6 host bits).",
        "Total addresses = 2 ^ host bits.",
        "Usable hosts = total − 2, because the first address is the network ID and the last is the broadcast."
      ],
      code: "/24 → 254 usable\n/26 →  62 usable\n/27 →  30 usable\n/30 →   2 usable",
      tip: "A /30 is the classic point-to-point link subnet."
    }
  },
  {
    id: "nf-3", domain: "network-fundamentals",
    question: "Which OSI layer is responsible for logical addressing and routing packets between networks?",
    options: ["Layer 2 – Data Link", "Layer 3 – Network", "Layer 4 – Transport", "Layer 5 – Session"],
    answer: [1],
    explanation: "Layer 3 uses IP addresses to identify networks and hosts, and routers forward packets based on those addresses.",
    lesson: {
      title: "OSI layers and their data units",
      points: [
        "L1 Physical: bits · L2 Data Link: frames (MAC addresses) · L3 Network: packets (IP) · L4 Transport: segments (TCP/UDP).",
        "Switches operate at Layer 2; routers operate at Layer 3.",
        "TCP/IP condenses the model into four layers: Application, Transport, Internet, Network Access."
      ],
      tip: "Please Do Not Throw Sausage Pizza Away = Physical, Data Link, Network, Transport, Session, Presentation, Application."
    }
  },
  {
    id: "nf-4", domain: "network-fundamentals",
    question: "Which sequence correctly describes the TCP three-way handshake?",
    options: ["SYN, SYN-ACK, ACK", "SYN, ACK, SYN-ACK", "ACK, SYN, FIN", "SYN, SYN, ACK"],
    answer: [0],
    explanation: "The client sends SYN, the server answers SYN-ACK, and the client completes the session with ACK.",
    lesson: {
      title: "TCP versus UDP",
      points: [
        "TCP is connection-oriented: it sets up a session, numbers segments, acknowledges delivery, and retransmits lost data.",
        "UDP is connectionless with no handshake or delivery guarantee, so it has less overhead. DNS queries, voice, and video often use it.",
        "The TCP handshake: client SYN → server SYN-ACK → client ACK."
      ]
    }
  },
  {
    id: "nf-5", domain: "network-fundamentals",
    question: "Which is a correctly abbreviated form of the IPv6 address 2001:0DB8:0000:0000:0000:FF00:0042:8329?",
    options: ["2001:db8::ff00:42:8329", "2001:db8::ff00::8329", "2001:db8:ff00:42:8329", "2001::db8::ff00:42:8329"],
    answer: [0],
    explanation: "Leading zeros are dropped and one run of all-zero groups becomes ::. Using :: twice makes the address ambiguous, and removing groups without :: leaves fewer than eight.",
    lesson: {
      title: "IPv6 shorthand rules",
      points: [
        "Drop leading zeros in each 16-bit group (0042 → 42).",
        "Replace one run of consecutive all-zero groups with ::.",
        ":: may appear only once, otherwise you could not tell how many groups each one stands for."
      ],
      code: "2001:0DB8:0000:0000:0000:FF00:0042:8329\n→ 2001:db8::ff00:42:8329"
    }
  },
  {
    id: "nf-6", domain: "network-fundamentals",
    question: "Which IPv6 prefix is used for link-local unicast addresses?",
    options: ["FC00::/7", "FE80::/10", "2000::/3", "FF00::/8"],
    answer: [1],
    explanation: "FE80::/10 is link-local: valid only on the local link and never routed. FC00::/7 is unique local, 2000::/3 is global unicast, and FF00::/8 is multicast.",
    lesson: {
      title: "IPv6 address types",
      points: [
        "Global unicast (2000::/3): routable on the internet.",
        "Link-local (FE80::/10): automatically created on every IPv6 interface and never forwarded by routers.",
        "Unique local (FC00::/7): private addressing, similar to RFC 1918.",
        "Multicast (FF00::/8) replaces broadcast. IPv6 has no broadcast."
      ]
    }
  },
  {
    id: "nf-7", domain: "network-fundamentals",
    question: "Which two addresses are private (RFC 1918) IPv4 addresses?",
    options: ["172.32.10.5", "10.200.1.1", "192.169.1.1", "172.16.5.4", "169.254.8.9"],
    answer: [1, 3],
    explanation: "RFC 1918 reserves 10.0.0.0/8, 172.16.0.0/12 (172.16–172.31) and 192.168.0.0/16. 172.32.x.x and 192.169.x.x fall just outside, and 169.254.0.0/16 is link-local (APIPA).",
    lesson: {
      title: "Private IPv4 ranges",
      points: [
        "Private addresses are not routed on the public internet; NAT lets them reach it.",
        "Watch the boundaries: only 172.16 through 172.31 is private in the 172 range."
      ],
      code: "10.0.0.0/8\n172.16.0.0/12   (172.16.0.0 – 172.31.255.255)\n192.168.0.0/16",
      tip: "A 169.254.x.x address usually means a host could not reach a DHCP server."
    }
  },
  {
    id: "nf-8", domain: "network-fundamentals",
    question: "Which cable type is traditionally needed to connect two switches when auto-MDIX is not available?",
    options: ["Straight-through", "Crossover", "Rollover", "Coaxial"],
    answer: [1],
    explanation: "Like devices (switch–switch, router–router, PC–router) use crossover cables, while unlike devices use straight-through. A rollover cable is for console access.",
    lesson: {
      title: "Copper cabling",
      points: [
        "Straight-through connects unlike devices (PC ↔ switch, router ↔ switch).",
        "Crossover connects like devices (switch ↔ switch, PC ↔ router).",
        "Rollover (console) cables connect a PC to a device's console port.",
        "Auto-MDIX lets modern ports detect the cable and adjust, so the distinction rarely matters in practice."
      ]
    }
  },

  // ───────────── Network Access ─────────────
  {
    id: "na-1", domain: "network-access",
    question: "What is the main purpose of a VLAN on a Layer 2 switch?",
    options: ["Encrypt traffic between switches", "Create separate broadcast domains", "Assign IP addresses to hosts", "Replace the need for routing"],
    answer: [1],
    explanation: "Each VLAN is a separate Layer 2 broadcast domain. Communication between VLANs still requires Layer 3 routing.",
    lesson: {
      title: "VLAN basics",
      points: [
        "A VLAN logically splits one physical switch into several Layer 2 networks.",
        "Broadcasts stay inside their VLAN, which reduces noise and improves security.",
        "Each VLAN normally maps to its own IP subnet, and traffic between VLANs must be routed."
      ]
    }
  },
  {
    id: "na-2", domain: "network-access",
    question: "Which configuration places an interface in VLAN 20 as a static access port?",
    options: [
      "switchport mode access, then switchport access vlan 20",
      "switchport mode trunk, then switchport trunk native vlan 20",
      "switchport access 20, then no shutdown",
      "interface vlan 20, then switchport mode access"
    ],
    answer: [0],
    explanation: "An access port is set with switchport mode access and assigned with switchport access vlan <id>. The trunk option carries many VLANs, and interface vlan 20 creates a Layer 3 SVI, not a port assignment.",
    lesson: {
      title: "Configuring access ports",
      points: [
        "Access ports carry a single VLAN and connect end devices.",
        "If the VLAN does not exist yet, the switch may create it when you assign it, but defining it explicitly is cleaner.",
        "Verify with show vlan brief."
      ],
      code: "interface g0/1\n switchport mode access\n switchport access vlan 20"
    }
  },
  {
    id: "na-3", domain: "network-access",
    question: "How does an 802.1Q trunk send frames that belong to the native VLAN?",
    options: ["Untagged", "With a double tag", "Dropped", "Only toward the root bridge"],
    answer: [0],
    explanation: "Frames in the native VLAN cross an 802.1Q trunk untagged. If the native VLAN differs between the two ends, traffic can leak between VLANs and the switches log a mismatch.",
    lesson: {
      title: "Trunks and the native VLAN",
      points: [
        "802.1Q inserts a 4-byte tag containing the VLAN ID into frames that cross a trunk.",
        "The native VLAN (VLAN 1 by default) is the one VLAN sent without a tag.",
        "Both ends of a trunk must agree on the native VLAN."
      ],
      code: "interface g0/24\n switchport mode trunk\n switchport trunk native vlan 99",
      tip: "Using an unused VLAN as native is a common hardening step."
    }
  },
  {
    id: "na-4", domain: "network-access",
    question: "How does Spanning Tree Protocol elect the root bridge?",
    options: ["The switch with the highest MAC address", "The switch with the lowest bridge ID", "The switch with the most ports", "The switch with the lowest port cost"],
    answer: [1],
    explanation: "The bridge ID is the priority (default 32768 plus the VLAN ID) followed by the MAC address. The lowest bridge ID wins, and the MAC address breaks priority ties.",
    lesson: {
      title: "STP root bridge election",
      points: [
        "STP removes Layer 2 loops by blocking redundant paths.",
        "The switch with the lowest bridge ID (priority, then MAC) becomes the root.",
        "Every non-root switch picks one root port (best path to root); each segment gets one designated port; the rest block."
      ],
      code: "spanning-tree vlan 10 root primary\nspanning-tree vlan 10 priority 4096",
      tip: "Priority changes in steps of 4096."
    }
  },
  {
    id: "na-5", domain: "network-access",
    question: "Which feature lets an access port facing an end host go to forwarding immediately instead of waiting through the STP listening and learning states?",
    options: ["BPDU Guard", "PortFast", "Root Guard", "UplinkFast"],
    answer: [1],
    explanation: "PortFast skips the listening and learning delay on edge ports. BPDU Guard is usually paired with it to shut the port down if a BPDU arrives, protecting the topology.",
    lesson: {
      title: "PortFast and BPDU Guard",
      points: [
        "PortFast is for ports that connect to end hosts only, never to other switches.",
        "BPDU Guard error-disables a PortFast port if it receives a BPDU.",
        "Rapid PVST+ already converges faster than classic STP, and edge ports behave like PortFast."
      ],
      code: "interface g0/5\n spanning-tree portfast\n spanning-tree bpduguard enable"
    }
  },
  {
    id: "na-6", domain: "network-access",
    question: "Which protocol is the IEEE standard for negotiating an EtherChannel?",
    options: ["PAgP", "LACP", "DTP", "CDP"],
    answer: [1],
    explanation: "LACP (IEEE 802.3ad / 802.1AX) is the open standard. PAgP is Cisco-proprietary, DTP negotiates trunking, and CDP is a discovery protocol.",
    lesson: {
      title: "EtherChannel",
      points: [
        "EtherChannel bundles several physical links into one logical link, adding bandwidth and redundancy. STP treats it as a single link.",
        "LACP modes: active and passive. PAgP modes: desirable and auto. “on” forms a channel with no negotiation.",
        "A channel forms if at least one side is active (LACP) or desirable (PAgP). Two passive or two auto sides never form one."
      ],
      code: "interface range g0/1-2\n channel-group 1 mode active"
    }
  },
  {
    id: "na-7", domain: "network-access",
    question: "How does a router-on-a-stick design route traffic between VLANs?",
    options: [
      "One subinterface per VLAN on a single trunk link",
      "One physical access interface per VLAN, with no tagging",
      "A Layer 2 EtherChannel to each host",
      "A routed port with no VLAN tags"
    ],
    answer: [0],
    explanation: "The router connects to a switch trunk and uses one 802.1Q subinterface per VLAN. Each subinterface holds the default gateway address for that VLAN.",
    lesson: {
      title: "Inter-VLAN routing",
      points: [
        "Router-on-a-stick: one trunk link, one subinterface per VLAN.",
        "Layer 3 switch: create an SVI (interface vlan X) for each VLAN and enable ip routing.",
        "Either way, the gateway address for hosts is the router or SVI address in their VLAN."
      ],
      code: "interface g0/0.10\n encapsulation dot1q 10\n ip address 192.168.10.1 255.255.255.0"
    }
  },
  {
    id: "na-8", domain: "network-access",
    question: "Which protocol do lightweight access points use to communicate with a wireless LAN controller?",
    options: ["CAPWAP", "LACP", "SNMP trap", "RADIUS"],
    answer: [0],
    explanation: "CAPWAP tunnels control and data traffic between lightweight APs and the WLC. LACP bundles links, SNMP monitors devices, and RADIUS authenticates users.",
    lesson: {
      title: "Wireless architectures",
      points: [
        "Autonomous APs are configured individually. Lightweight APs are managed centrally by a WLC through CAPWAP tunnels.",
        "Cloud-based designs manage APs from a cloud dashboard.",
        "In the 2.4 GHz band, channels 1, 6, and 11 are the non-overlapping choices."
      ]
    }
  },

  // ───────────── IP Connectivity ─────────────
  {
    id: "ip-1", domain: "ip-connectivity",
    question: "A router has two matching routes for a destination address. Which route is preferred first?",
    options: ["The route with the longest prefix match", "The route learned most recently", "The route with the lowest next-hop IP", "The route with the largest subnet"],
    answer: [0],
    explanation: "Routers use longest-prefix match: the most specific route (the one with the most matching network bits) wins before administrative distance or metric are considered.",
    lesson: {
      title: "How a router chooses a route",
      points: [
        "Step 1: longest prefix match. A /28 beats a /24 for an address inside both.",
        "Step 2: if prefix lengths tie, the lowest administrative distance (AD) wins.",
        "Step 3: if AD also ties within the same protocol, the lowest metric wins."
      ],
      code: "10.1.1.0/24 via R2\n10.1.1.64/26 via R3   ← used for 10.1.1.70"
    }
  },
  {
    id: "ip-2", domain: "ip-connectivity",
    question: "A router learns the same prefix from OSPF, RIP, and a static route (all with default administrative distances). Which route is installed in the routing table?",
    options: ["The OSPF route", "The RIP route", "The static route", "All three, load balanced"],
    answer: [2],
    explanation: "A static route has an AD of 1, lower than OSPF (110) and RIP (120), so it is installed. A lower AD means a more trusted source.",
    lesson: {
      title: "Administrative distance",
      points: [
        "AD ranks how trustworthy a routing source is when several offer the same prefix.",
        "Lower AD wins. It is compared only between different sources for the same prefix length.",
        "Metrics are compared only between routes from the same routing protocol."
      ],
      code: "Connected   0\nStatic      1\neBGP       20\nEIGRP      90\nOSPF      110\nRIP       120"
    }
  },
  {
    id: "ip-3", domain: "ip-connectivity",
    question: "Which command configures a default route toward the next hop 203.0.113.1?",
    options: [
      "ip route 0.0.0.0 0.0.0.0 203.0.113.1",
      "ip route 0.0.0.0 255.255.255.255 203.0.113.1",
      "ip default-network 203.0.113.1 0.0.0.0",
      "ip route 203.0.113.1 0.0.0.0 0.0.0.0"
    ],
    answer: [0],
    explanation: "A default route matches everything: network 0.0.0.0 with mask 0.0.0.0, followed by the next hop. A mask of 255.255.255.255 would match only the host 0.0.0.0.",
    lesson: {
      title: "Static and default routes",
      points: [
        "Static route syntax: ip route <network> <mask> <next-hop or exit interface>.",
        "The default route (0.0.0.0/0) is the route of last resort and has the shortest possible prefix.",
        "It appears in show ip route with the code S*."
      ],
      code: "ip route 10.2.0.0 255.255.0.0 192.168.1.2\nip route 0.0.0.0 0.0.0.0 203.0.113.1"
    }
  },
  {
    id: "ip-4", domain: "ip-connectivity",
    question: "Which two values must match for two OSPF routers to become neighbors on a shared segment?",
    options: ["Area ID", "Router ID", "Hello and dead timers", "OSPF process ID", "Interface cost"],
    answer: [0, 2],
    explanation: "Area ID, hello and dead intervals, subnet and mask, authentication, and stub flags must match. Router IDs must be unique, the process ID is only locally significant, and cost can differ per interface.",
    lesson: {
      title: "OSPF neighbor requirements",
      points: [
        "Must match: area ID, hello/dead timers, subnet and mask, authentication, area type flags.",
        "Must differ: router ID (duplicates break adjacency).",
        "Need not match: process ID, interface cost."
      ],
      code: "router ospf 1\n network 10.0.0.0 0.0.0.255 area 0",
      tip: "Check with show ip ospf neighbor and show ip ospf interface."
    }
  },
  {
    id: "ip-5", domain: "ip-connectivity",
    question: "On a multiaccess Ethernet segment, how is the OSPF designated router (DR) elected?",
    options: [
      "Highest interface priority, with the highest router ID as the tie-breaker",
      "Lowest router ID",
      "Highest interface bandwidth",
      "The router with the most neighbors"
    ],
    answer: [0],
    explanation: "The router with the highest OSPF interface priority becomes DR (default priority is 1), and the highest router ID breaks ties. Priority 0 means the router can never become DR or BDR.",
    lesson: {
      title: "OSPF DR and BDR",
      points: [
        "On broadcast networks, a DR and a backup DR (BDR) cut down the number of adjacencies. Other routers (DROTHERs) become fully adjacent only with the DR and BDR.",
        "Election: highest priority wins, then highest router ID.",
        "The election is not preemptive: a new router with higher priority does not displace an existing DR.",
        "Point-to-point links do not elect a DR."
      ]
    }
  },
  {
    id: "ip-6", domain: "ip-connectivity",
    question: "A router has no router-id configured. It has Loopback0 10.0.0.1 and active interfaces 192.168.1.1 and 172.16.1.1. Which address becomes the OSPF router ID?",
    options: ["10.0.0.1", "192.168.1.1", "172.16.1.1", "The lowest IP address on the router"],
    answer: [0],
    explanation: "OSPF uses a manually configured router-id first, then the highest loopback address, then the highest active physical interface address. A loopback exists, so 10.0.0.1 is chosen even though it is numerically lower.",
    lesson: {
      title: "OSPF router ID selection",
      points: [
        "1) An explicit router-id command.",
        "2) The highest IPv4 address on a loopback interface.",
        "3) The highest IPv4 address on an active physical interface."
      ],
      code: "router ospf 1\n router-id 1.1.1.1",
      tip: "A changed router ID takes effect after clear ip ospf process or a reload."
    }
  },
  {
    id: "ip-7", domain: "ip-connectivity",
    question: "What is the main purpose of a first-hop redundancy protocol such as HSRP?",
    options: [
      "Provide a virtual default gateway so hosts keep connectivity if a router fails",
      "Load balance DNS queries",
      "Encrypt traffic between routers",
      "Prevent Layer 2 loops"
    ],
    answer: [0],
    explanation: "Hosts point at a virtual IP address. If the active router fails, a standby router takes over that address, so hosts need no changes.",
    lesson: {
      title: "First-hop redundancy",
      points: [
        "HSRP (Cisco) uses an active router and a standby router sharing a virtual IP and MAC address.",
        "VRRP is the open standard equivalent. GLBP (Cisco) can also load balance across gateways.",
        "Hosts use the virtual IP as their default gateway."
      ]
    }
  },
  {
    id: "ip-8", domain: "ip-connectivity",
    question: "In the route entry  O 10.1.1.0/24 [110/20] via 192.168.1.2,  what does the value 20 represent?",
    options: ["The administrative distance", "The OSPF metric (cost)", "The hop count", "The route age in seconds"],
    answer: [1],
    explanation: "Inside the brackets the first number is the administrative distance (110 for OSPF) and the second is the metric. OSPF's metric is cost.",
    lesson: {
      title: "Reading the routing table",
      points: [
        "Format: [administrative distance / metric].",
        "Codes: C connected, L local, S static, O OSPF, S* candidate default.",
        "Next hop and outgoing interface follow the brackets."
      ],
      code: "O  10.1.1.0/24 [110/20] via 192.168.1.2, 00:01:12, GigabitEthernet0/1"
    }
  },

  // ───────────── IP Services ─────────────
  {
    id: "is-1", domain: "ip-services",
    question: "Which protocol does an IPv4 host commonly use to automatically obtain an IP address and subnet mask?",
    options: ["DNS", "NTP", "DHCP", "SNMP"],
    answer: [2],
    explanation: "DHCP dynamically provides hosts with an IPv4 address, subnet mask, default gateway, and often DNS servers.",
    lesson: {
      title: "DHCP",
      points: [
        "The DORA exchange: Discover, Offer, Request, Acknowledge.",
        "Discover is a broadcast. If the DHCP server is on another subnet, a router uses ip helper-address to relay it.",
        "DHCP uses UDP ports 67 (server) and 68 (client)."
      ],
      code: "interface g0/1\n ip helper-address 10.0.0.10"
    }
  },
  {
    id: "is-2", domain: "ip-services",
    question: "Which NAT type maps many inside local addresses to a single inside global address by using unique port numbers?",
    options: ["Static NAT", "Dynamic NAT with a pool", "PAT (NAT overload)", "Port mirroring"],
    answer: [2],
    explanation: "PAT, also called NAT overload, tracks each translation using the source port so many hosts can share one public address.",
    lesson: {
      title: "NAT and PAT",
      points: [
        "Static NAT is a fixed one-to-one mapping, often for servers.",
        "Dynamic NAT maps inside hosts to a pool of public addresses.",
        "PAT (overload) multiplexes many hosts onto one address using port numbers.",
        "Terms: inside local (private host address) and inside global (its public address)."
      ],
      code: "access-list 1 permit 192.168.10.0 0.0.0.255\nip nat inside source list 1 interface g0/1 overload"
    }
  },
  {
    id: "is-3", domain: "ip-services",
    question: "Which DNS record type maps a hostname to an IPv4 address?",
    options: ["AAAA", "A", "MX", "PTR"],
    answer: [1],
    explanation: "An A record maps a name to an IPv4 address. AAAA maps to IPv6, MX identifies mail servers, and PTR performs reverse lookups.",
    lesson: {
      title: "DNS records",
      points: [
        "A: name → IPv4. AAAA: name → IPv6.",
        "CNAME: alias to another name. MX: mail exchanger. PTR: IP → name (reverse lookup).",
        "DNS normally uses UDP port 53, and TCP for large responses and zone transfers."
      ]
    }
  },
  {
    id: "is-4", domain: "ip-services",
    question: "What does an NTP stratum value of 1 indicate?",
    options: [
      "The device is directly connected to an authoritative time source",
      "The device has the least accurate clock",
      "The device is a client that has not synchronized",
      "The device gets its time from a stratum 2 server"
    ],
    answer: [0],
    explanation: "Stratum 0 is the reference clock (GPS or atomic), and a stratum 1 server is attached directly to it. Each hop away adds one to the stratum.",
    lesson: {
      title: "NTP",
      points: [
        "NTP keeps device clocks synchronized, which makes logs and certificates dependable.",
        "Lower stratum = closer to the authoritative source. 16 means unsynchronized.",
        "NTP uses UDP port 123."
      ],
      code: "ntp server 192.0.2.10\nshow ntp status"
    }
  },
  {
    id: "is-5", domain: "ip-services",
    question: "Which syslog severity level is the most severe?",
    options: ["0 – Emergency", "1 – Alert", "6 – Informational", "7 – Debugging"],
    answer: [0],
    explanation: "Lower numbers are more severe. Level 0 (Emergency) means the system is unusable.",
    lesson: {
      title: "Syslog severity levels",
      points: [
        "Setting a logging level includes that level and every more severe (lower numbered) one.",
        "Level 6 informational is the default for many destinations."
      ],
      code: "0 Emergency\n1 Alert\n2 Critical\n3 Error\n4 Warning\n5 Notice\n6 Informational\n7 Debugging",
      tip: "Every Awesome Cisco Engineer Will Need Ice cream Daily."
    }
  },
  {
    id: "is-6", domain: "ip-services",
    question: "Which SNMP message does an agent send to the management station without being polled?",
    options: ["Get", "Set", "Trap", "Walk"],
    answer: [2],
    explanation: "A trap is an unsolicited notification from an agent to the NMS. Get and Set are requests sent from the NMS.",
    lesson: {
      title: "SNMP",
      points: [
        "A network management system (NMS) polls agents on devices and reads data defined by MIBs.",
        "Get reads values, Set changes them, and traps or informs are agent-initiated alerts.",
        "SNMPv3 adds authentication and encryption; v1 and v2c use only a community string."
      ]
    }
  },
  {
    id: "is-7", domain: "ip-services",
    question: "Which DSCP marking is typically used for voice traffic?",
    options: ["AF11", "CS1", "EF", "Default (BE)"],
    answer: [2],
    explanation: "Expedited Forwarding (EF, DSCP 46) is the standard marking for voice because it needs low delay, jitter, and loss.",
    lesson: {
      title: "QoS basics",
      points: [
        "Voice needs low delay, low jitter, and very little loss.",
        "Traffic is classified and marked (for example, DSCP EF = 46), then queued, policed, or shaped according to policy.",
        "Best effort (default) is unmarked traffic with no special treatment."
      ]
    }
  },
  {
    id: "is-8", domain: "ip-services",
    question: "Which command generates the keys required to enable SSH on a Cisco router?",
    options: ["crypto key generate rsa", "ssh enable rsa", "ip ssh generate keys", "transport input ssh"],
    answer: [0],
    explanation: "SSH needs RSA keys, which crypto key generate rsa creates (and a hostname plus domain name must already be set). transport input ssh only restricts the VTY lines.",
    lesson: {
      title: "Enabling SSH",
      points: [
        "Prerequisites: a hostname, an ip domain-name, and RSA keys.",
        "Create a local user, then restrict the VTY lines to SSH with login local.",
        "SSH replaces Telnet because it encrypts the session."
      ],
      code: "hostname R1\nip domain-name lab.local\ncrypto key generate rsa modulus 2048\nusername admin secret S3cret!\nline vty 0 4\n transport input ssh\n login local"
    }
  },

  // ───────────── Security Fundamentals ─────────────
  {
    id: "sf-1", domain: "security-fundamentals",
    question: "Which feature prevents rogue DHCP servers by only accepting DHCP server replies on trusted ports?",
    options: ["Port security", "DHCP snooping", "Dynamic ARP Inspection", "BPDU Guard"],
    answer: [1],
    explanation: "DHCP snooping marks ports as trusted or untrusted and drops server messages from untrusted ports. It also builds a binding table that Dynamic ARP Inspection can use.",
    lesson: {
      title: "Common Layer 2 attacks",
      points: [
        "DHCP spoofing or starvation → DHCP snooping.",
        "ARP poisoning → Dynamic ARP Inspection (DAI), which relies on the snooping table.",
        "MAC flooding → port security.",
        "Rogue switches and STP manipulation → BPDU Guard and Root Guard."
      ],
      code: "ip dhcp snooping\nip dhcp snooping vlan 10\ninterface g0/24\n ip dhcp snooping trust"
    }
  },
  {
    id: "sf-2", domain: "security-fundamentals",
    question: "What is the default violation mode for switch port security?",
    options: ["Shutdown", "Restrict", "Protect", "Shutdown VLAN"],
    answer: [0],
    explanation: "The default is shutdown, which puts the port in the err-disabled state. Restrict drops violating frames and logs them, and protect drops them silently.",
    lesson: {
      title: "Port security",
      points: [
        "Port security limits which and how many MAC addresses may use an access port.",
        "Sticky learning saves dynamically learned MACs to the running config.",
        "Recover an err-disabled port with shutdown then no shutdown."
      ],
      code: "interface g0/2\n switchport mode access\n switchport port-security\n switchport port-security maximum 2\n switchport port-security mac-address sticky\n switchport port-security violation restrict"
    }
  },
  {
    id: "sf-3", domain: "security-fundamentals",
    question: "What happens to a packet that matches none of the entries in an ACL?",
    options: ["It is permitted", "It is denied by the implicit deny", "It is logged and forwarded", "It is sent to the next ACL"],
    answer: [1],
    explanation: "Every ACL ends with an invisible deny any. At least one permit must exist for traffic to pass.",
    lesson: {
      title: "ACL behavior",
      points: [
        "Entries are checked top-down and the first match decides.",
        "An implicit deny any sits at the end of every ACL.",
        "Standard ACLs match source address only. Extended ACLs match protocol, source, destination, and ports.",
        "ACLs use wildcard masks, which are the inverse of subnet masks."
      ],
      code: "access-list 10 permit 192.168.10.0 0.0.0.255"
    }
  },
  {
    id: "sf-4", domain: "security-fundamentals",
    question: "Where should an extended ACL generally be placed?",
    options: ["As close to the destination as possible", "As close to the source as possible", "On the interface with the most bandwidth", "On a loopback interface"],
    answer: [1],
    explanation: "Extended ACLs can match both source and destination, so applying them near the source drops unwanted traffic before it crosses the network. Standard ACLs go near the destination.",
    lesson: {
      title: "ACL placement",
      points: [
        "Standard ACL: only looks at the source, so place it near the destination to avoid blocking too much.",
        "Extended ACL: precise matching, so place it near the source.",
        "Direction matters: in filters traffic entering an interface, out filters traffic leaving it."
      ]
    }
  },
  {
    id: "sf-5", domain: "security-fundamentals",
    question: "Which command applies access list 110 to filter traffic entering an interface?",
    options: ["ip access-group 110 in", "access-class 110 in", "ip access-list 110 apply in", "ip filter 110 in"],
    answer: [0],
    explanation: "ip access-group applies an ACL to an interface. access-class is used on VTY lines to limit remote access.",
    lesson: {
      title: "Applying ACLs",
      points: [
        "Create the ACL, then apply it with ip access-group <id> in|out under the interface.",
        "To protect management access, use access-class on the VTY lines instead.",
        "Verify with show access-lists and show ip interface."
      ],
      code: "access-list 110 permit tcp 10.1.1.0 0.0.0.255 any eq 443\ninterface g0/1\n ip access-group 110 in"
    }
  },
  {
    id: "sf-6", domain: "security-fundamentals",
    question: "Which command stores the privileged EXEC password as a hash?",
    options: ["enable password cisco", "enable secret cisco", "service password-encryption", "username admin password cisco"],
    answer: [1],
    explanation: "enable secret stores a hash. enable password is plain text unless service password-encryption is on, and that only applies weak type 7 obfuscation.",
    lesson: {
      title: "Securing device access",
      points: [
        "Use enable secret (hashed) rather than enable password.",
        "service password-encryption only obscures plain-text passwords with a reversible type 7 scheme.",
        "Prefer SSH over Telnet and set an exec-timeout on lines.",
        "Use username … secret for local accounts."
      ]
    }
  },
  {
    id: "sf-7", domain: "security-fundamentals",
    question: "Which AAA protocol encrypts the entire packet body and separates authentication from authorization?",
    options: ["RADIUS", "TACACS+", "LDAP", "SNMPv2c"],
    answer: [1],
    explanation: "TACACS+ (TCP port 49) encrypts the whole body and keeps authentication, authorization, and accounting separate. RADIUS encrypts only the password and combines authentication and authorization.",
    lesson: {
      title: "AAA",
      points: [
        "Authentication = who you are. Authorization = what you may do. Accounting = what you did.",
        "RADIUS: open standard, UDP 1812/1813, encrypts only the password.",
        "TACACS+: Cisco, TCP 49, encrypts the full payload, and is favored for device administration."
      ]
    }
  },
  {
    id: "sf-8", domain: "security-fundamentals",
    question: "Which two features help protect a switched LAN at Layer 2?",
    options: ["Dynamic ARP Inspection", "NAT overload", "Port security", "OSPF authentication", "An extended ACL on a WAN link"],
    answer: [0, 2],
    explanation: "DAI and port security both protect the access layer. NAT translates addresses, OSPF authentication protects routing, and a WAN ACL filters at Layer 3 and above.",
    lesson: {
      title: "Threats, vulnerabilities, and mitigation",
      points: [
        "Threat: something that could cause harm. Vulnerability: a weakness. Exploit: the method used to take advantage of it.",
        "Mitigate with defense in depth: least privilege, patching, user training, and layered controls.",
        "At the access layer, use port security, DHCP snooping, DAI, and BPDU Guard."
      ]
    }
  },

  // ───────────── Automation & Programmability ─────────────
  {
    id: "ap-1", domain: "automation-programmability",
    question: "In a software-defined (controller-based) network, which plane is centralized in the controller?",
    options: ["Data plane", "Control plane", "Forwarding plane", "Physical plane"],
    answer: [1],
    explanation: "The controller centralizes the control plane (decisions about where traffic goes), while devices keep forwarding in the data plane.",
    lesson: {
      title: "Planes and controllers",
      points: [
        "Data plane: forwards traffic. Control plane: decides how (routing and switching logic). Management plane: configuration and monitoring.",
        "In traditional networks each device runs its own control plane.",
        "In SDN, a controller centralizes it and programs the devices."
      ]
    }
  },
  {
    id: "ap-2", domain: "automation-programmability",
    question: "Which HTTP method is typically used to create a new resource in a REST API?",
    options: ["GET", "POST", "DELETE", "HEAD"],
    answer: [1],
    explanation: "POST creates a resource. GET reads, PUT or PATCH update, and DELETE removes.",
    lesson: {
      title: "REST and CRUD",
      points: [
        "REST uses standard HTTP methods against URLs that identify resources.",
        "Requests are stateless: each one carries everything needed.",
        "Data is commonly exchanged as JSON."
      ],
      code: "POST         → Create\nGET          → Read\nPUT / PATCH  → Update\nDELETE       → Delete"
    }
  },
  {
    id: "ap-3", domain: "automation-programmability",
    question: "Which of the following is valid JSON?",
    options: ["{\"name\": \"R1\", \"ports\": [1, 2]}", "{'name': 'R1'}", "{name: \"R1\"}", "[\"name\" = \"R1\"]"],
    answer: [0],
    explanation: "JSON requires double-quoted keys and strings, colons between keys and values, and commas between items. Single quotes and unquoted keys are invalid.",
    lesson: {
      title: "JSON structure",
      points: [
        "Objects use {} with key: value pairs. Arrays use [].",
        "Keys and strings use double quotes.",
        "Values can be strings, numbers, booleans (true/false), null, objects, or arrays."
      ],
      code: "{\n  \"hostname\": \"R1\",\n  \"interfaces\": [\"g0/0\", \"g0/1\"],\n  \"enabled\": true\n}"
    }
  },
  {
    id: "ap-4", domain: "automation-programmability",
    question: "Which API type does an SDN controller use to communicate with the network devices it manages?",
    options: ["Northbound API", "Southbound API", "Eastbound API", "Presentation API"],
    answer: [1],
    explanation: "Southbound APIs (such as NETCONF, OpenFlow, and SNMP) connect the controller to devices. Northbound APIs connect applications and scripts to the controller.",
    lesson: {
      title: "Northbound vs southbound",
      points: [
        "Northbound: applications, scripts, and you → controller, usually through a REST API.",
        "Southbound: controller → devices, using NETCONF, RESTCONF, OpenFlow, SNMP, or CLI.",
        "Picture the controller in the middle, with apps above it and devices below."
      ]
    }
  },
  {
    id: "ap-5", domain: "automation-programmability",
    question: "Which statement about Ansible is true?",
    options: [
      "It is agentless and typically connects to devices over SSH",
      "It requires an agent installed on every managed device",
      "It uses a pull model driven by a master server",
      "Playbooks must be written in binary format"
    ],
    answer: [0],
    explanation: "Ansible is agentless and pushes changes, usually over SSH, using YAML playbooks. Puppet and Chef are agent-based and pull from a master.",
    lesson: {
      title: "Configuration management tools",
      points: [
        "Ansible: agentless, push model, YAML playbooks, SSH.",
        "Puppet and Chef: agent-based, pull model, with manifests (Puppet) or recipes (Chef).",
        "These tools apply consistent configuration across many devices."
      ]
    }
  },
  {
    id: "ap-6", domain: "automation-programmability",
    question: "Which best describes a declarative automation tool such as Terraform?",
    options: [
      "You describe the desired end state and the tool works out the steps",
      "You write every step in the exact order it must run",
      "It only works with physical hardware",
      "It requires an agent on every device"
    ],
    answer: [0],
    explanation: "Declarative tools take a description of the desired outcome and determine how to reach it. Imperative tools run explicit steps you define.",
    lesson: {
      title: "Infrastructure as code",
      points: [
        "Declarative: say what you want. Imperative: say how to do it.",
        "Terraform uses HCL to describe infrastructure, then plan shows the changes and apply performs them.",
        "Keeping definitions in version control gives you history, review, and repeatability."
      ]
    }
  },
  {
    id: "ap-7", domain: "automation-programmability",
    question: "Which Cisco solution is an intent-based networking controller for campus networks, providing automation and assurance?",
    options: ["Cisco DNA Center", "Cisco ISE", "Cisco Umbrella", "Cisco Packet Tracer"],
    answer: [0],
    explanation: "Cisco DNA Center (now Catalyst Center) provides design, policy, provisioning, and assurance for campus networks. ISE does access policy, Umbrella is cloud security, and Packet Tracer is a simulator.",
    lesson: {
      title: "Intent-based networking",
      points: [
        "You state a business intent and the controller translates it into device configuration.",
        "DNA Center covers design, policy, provision, and assurance, and underpins SD-Access.",
        "This contrasts with configuring each device by hand through the CLI."
      ]
    }
  },
  {
    id: "ap-8", domain: "automation-programmability",
    question: "A REST API call returns HTTP status 404. What does that mean?",
    options: ["The request succeeded", "The client is not authorized", "The requested resource was not found", "The server had an internal error"],
    answer: [2],
    explanation: "404 Not Found means the server could not find the requested resource. 401 is unauthorized, and 500 is a server error.",
    lesson: {
      title: "HTTP status codes",
      points: [
        "2xx success, 3xx redirection, 4xx client error, 5xx server error.",
        "Common ones: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error."
      ]
    }
  }
];
