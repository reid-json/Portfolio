studyTopics.push(

  {
    "domain": "network-access",
    "title": "STP purpose and variants",
    "points": [
      "STP prevents Layer 2 loops by blocking redundant paths.",
      "IEEE 802.1D converges more slowly than Rapid PVST+.",
      "Rapid PVST+ runs a spanning-tree instance per VLAN."
    ],
    "questions": [
      [
        "What problem does Spanning Tree Protocol primarily prevent in a switched Ethernet network?",
        [
          "Layer 2 forwarding loops",
          "Duplicate IP addresses",
          "Wireless channel overlap",
          "Routing-table recursion"
        ],
        [
          0
        ],
        "STP blocks redundant Layer 2 paths to prevent loops and broadcast storms; duplicate addressing is unrelated."
      ],
      [
        "Which statement best describes classic IEEE 802.1D STP?",
        [
          "It routes between VLANs using shortest paths",
          "It provides a loop-free Layer 2 topology using a spanning tree",
          "It encrypts switch-to-switch traffic",
          "It assigns VLANs dynamically to access ports"
        ],
        [
          1
        ],
        "802.1D computes a loop-free bridged topology; it does not route or encrypt frames."
      ],
      [
        "What is a key characteristic of Rapid PVST+?",
        [
          "It runs one tree for every IP subnet",
          "It disables BPDUs on access links",
          "It provides a separate rapid spanning-tree instance per VLAN",
          "It replaces the need for a root bridge"
        ],
        [
          2
        ],
        "Rapid PVST+ runs a rapid spanning-tree instance for each VLAN; each instance still elects a root bridge."
      ],
      [
        "A switch has two Layer 2 paths to the same destination. What does STP do with the redundant path?",
        [
          "It converts it to a routed port",
          "It bundles it into a trunk automatically",
          "It forwards frames on both paths",
          "It places a port into a nonforwarding role/state"
        ],
        [
          3
        ],
        "STP prevents a loop by keeping a redundant path from forwarding; it does not automatically bundle links."
      ],
      [
        "Which two descriptions are accurate for STP behavior?",
        [
          "It exchanges BPDUs to calculate a topology",
          "It forwards every redundant link simultaneously",
          "It elects a root bridge for an STP instance",
          "It requires an IP address on every switch port",
          "It prevents loops by disabling VLAN tagging"
        ],
        [
          0,
          2
        ],
        "STP exchanges BPDUs and elects a root bridge; simultaneous forwarding on redundant links would create loops."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "Bridge ID and root election",
    "points": [
      "The root bridge is the reference point for STP path calculations.",
      "Bridge ID includes priority, extended system ID, and MAC address.",
      "The numerically lowest Bridge ID wins the root election."
    ],
    "questions": [
      [
        "Which switch becomes the root bridge when all switches participate in the same STP instance?",
        [
          "The switch with the lowest numerical Bridge ID",
          "The switch with the highest port count",
          "The switch with the highest MAC address",
          "The switch with the fastest uplink"
        ],
        [
          0
        ],
        "STP elects the lowest Bridge ID; port count and link speed do not determine the root election."
      ],
      [
        "What fields are used in a switch Bridge ID?",
        [
          "VLAN name and management IP address",
          "Bridge priority, extended system ID, and MAC address",
          "Port priority and interface number",
          "Hostname and spanning-tree timer values"
        ],
        [
          1
        ],
        "The Bridge ID combines priority, the extended system ID (commonly VLAN ID), and MAC address."
      ],
      [
        "Two switches have the same STP priority and VLAN ID. Which value breaks the Bridge ID tie?",
        [
          "The highest interface bandwidth",
          "The oldest uptime",
          "The lowest MAC address",
          "The lowest management IP address"
        ],
        [
          2
        ],
        "When priority and system ID tie, the lower MAC address gives the lower Bridge ID."
      ],
      [
        "An administrator wants switch SW1 to be preferred as the root bridge for VLAN 20. Which action is appropriate?",
        [
          "Increase SW1's MAC address",
          "Set all SW1 ports to PortFast",
          "Raise the STP hello timer",
          "Configure a lower STP priority for VLAN 20 on SW1"
        ],
        [
          3
        ],
        "A lower priority lowers the Bridge ID and makes SW1 more likely to win; PortFast does not affect root election."
      ],
      [
        "Which two statements about root bridge election are correct?",
        [
          "The lowest Bridge ID wins",
          "The switch with the highest priority number wins",
          "A lower configured priority is more preferred",
          "The root is selected independently for each physical port",
          "MAC address is never used in a tie"
        ],
        [
          0,
          2
        ],
        "The lowest Bridge ID wins, and a lower priority value improves a switch's chance; a tie can be broken by MAC address."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "STP port roles and states",
    "points": [
      "A root port is the best path from a nonroot switch toward the root.",
      "A designated port forwards toward a segment; alternate ports provide backup paths.",
      "Classic STP and Rapid STP use different port-state names."
    ],
    "questions": [
      [
        "On a nonroot switch, which port role identifies the best path toward the root bridge?",
        [
          "Root port",
          "Designated port",
          "Alternate port",
          "Backup port"
        ],
        [
          0
        ],
        "The root port is the nonroot switch's best path toward the root; a designated port serves its segment."
      ],
      [
        "Which role is assigned to the forwarding port that advertises the best path onto a LAN segment?",
        [
          "Alternate",
          "Designated",
          "Root",
          "Disabled"
        ],
        [
          1
        ],
        "The designated port forwards for its segment; an alternate port remains a backup path."
      ],
      [
        "Which set contains the classic 802.1D STP port states?",
        [
          "Discarding, probing, routing, forwarding",
          "Down, init, active, standby",
          "Blocking, listening, learning, forwarding, disabled",
          "Learning, forwarding, alternate, root"
        ],
        [
          2
        ],
        "Classic 802.1D includes blocking, listening, learning, forwarding, and disabled; Rapid STP consolidates states."
      ],
      [
        "In Rapid STP, which state does a port use when it is not forwarding user traffic?",
        [
          "Listening",
          "Blocking",
          "Disabled-only",
          "Discarding"
        ],
        [
          3
        ],
        "Rapid STP uses discarding for a nonforwarding port; listening and blocking are classic 802.1D names."
      ],
      [
        "A redundant link is selected as a backup path but is not forwarding. What is its likely Rapid PVST+ role?",
        [
          "Alternate",
          "Root",
          "Designated",
          "Edge"
        ],
        [
          0
        ],
        "An alternate port provides a backup route toward the root while remaining nonforwarding; edge describes an endpoint-facing property."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "STP path cost and topology",
    "points": [
      "Path cost is accumulated toward the root bridge.",
      "Lower total path cost is preferred.",
      "Link speed influences cost; port identifiers can resolve ties."
    ],
    "questions": [
      [
        "When a switch selects its root port, which path is preferred?",
        [
          "The path with the most switches",
          "The path with the lowest total STP cost",
          "The path with the highest total STP cost",
          "The path through the highest MAC address"
        ],
        [
          1
        ],
        "STP prefers the lowest accumulated cost to the root; it does not prefer a longer or higher-cost path."
      ],
      [
        "What is the usual relationship between Ethernet link speed and STP path cost?",
        [
          "Higher speed always has a higher path cost",
          "Path cost is unrelated to bandwidth",
          "Higher speed usually has a lower path cost",
          "Only duplex affects path cost"
        ],
        [
          2
        ],
        "STP cost generally decreases as link bandwidth increases, making a faster path preferable when other factors tie."
      ],
      [
        "Two equal-cost paths reach the root. Which information can help STP break the tie?",
        [
          "The root's hostname",
          "The switch's management subnet mask",
          "The number of connected wireless clients",
          "The sender port ID and receiving port ID"
        ],
        [
          3
        ],
        "STP compares BPDU attributes including sender bridge and port identifiers to choose consistently between tied paths."
      ],
      [
        "An engineer wants to inspect VLAN 30's STP path and port roles. Which IOS command is most useful?",
        [
          "show spanning-tree vlan 30",
          "show ip route 30",
          "show interfaces trunk 30",
          "show vlan brief 30"
        ],
        [
          0
        ],
        "show spanning-tree vlan 30 displays the root, costs, port roles, and states; the other commands do not."
      ],
      [
        "Which two changes can affect which redundant link STP selects as the forwarding path?",
        [
          "Changing a relevant port cost",
          "Changing the switch hostname",
          "Changing a relevant port priority",
          "Changing the interface description",
          "Changing the console password"
        ],
        [
          0,
          2
        ],
        "Port cost and port priority participate in STP path and tie-breaking decisions; cosmetic settings do not."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "PortFast and BPDU protection",
    "points": [
      "PortFast is intended for ports connected to end devices.",
      "PortFast moves an edge port quickly to forwarding.",
      "BPDU Guard protects edge ports from unexpected switch BPDUs."
    ],
    "questions": [
      [
        "What is the primary purpose of PortFast on an access port connected to a workstation?",
        [
          "Encrypt frames during boot",
          "Allow the port to begin forwarding without the usual STP delay",
          "Force the port to become the root port",
          "Increase the link's STP path cost"
        ],
        [
          1
        ],
        "PortFast lets an edge port transition quickly to forwarding; it does not change root election or encryption."
      ],
      [
        "What is the typical result when BPDU Guard receives a BPDU on a protected PortFast port?",
        [
          "The switch elects the endpoint as root",
          "The BPDU is converted to a DHCP request",
          "The port is placed into an error-disabled state",
          "The port becomes a trunk automatically"
        ],
        [
          2
        ],
        "BPDU Guard shuts down the protected edge port after an unexpected BPDU, protecting the topology."
      ],
      [
        "Which interface is the best candidate for PortFast?",
        [
          "A link between distribution switches",
          "A redundant trunk to another switch",
          "A root port connected to a switch",
          "An access port connected to a single user PC"
        ],
        [
          3
        ],
        "PortFast is for endpoint-facing edge ports; applying it to a switch-to-switch link risks a transient loop."
      ],
      [
        "Which global configuration command enables BPDU Guard by default on PortFast edge ports?",
        [
          "spanning-tree bpduguard default",
          "spanning-tree portfast default",
          "spanning-tree guard root default",
          "spanning-tree mode bpduguard"
        ],
        [
          0
        ],
        "spanning-tree bpduguard default enables the protection for PortFast ports; portfast default enables PortFast itself."
      ],
      [
        "Which two statements correctly describe PortFast and BPDU Guard?",
        [
          "PortFast is appropriate on an endpoint-facing access port",
          "BPDU Guard accepts BPDUs from downstream switches",
          "BPDU Guard can error-disable a port that receives a BPDU",
          "PortFast elects the local switch as root",
          "PortFast should be enabled on every inter-switch trunk"
        ],
        [
          0,
          2
        ],
        "PortFast speeds edge-port forwarding and BPDU Guard protects that edge from unexpected BPDUs; neither makes every trunk safe."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "Root Guard and STP commands",
    "points": [
      "Root Guard keeps a downstream port from becoming a path to a superior root.",
      "Root Guard is useful where the root should remain on the intended side.",
      "show spanning-tree reveals root, role, state, and cost."
    ],
    "questions": [
      [
        "What does Root Guard do when a port receives a superior BPDU?",
        [
          "It changes the local switch priority to zero",
          "It places the port in a root-inconsistent state",
          "It forwards the BPDU unchanged to all VLANs",
          "It enables PortFast on the port"
        ],
        [
          1
        ],
        "Root Guard prevents accepting a superior root path by placing the port into root-inconsistent; it does not alter local priority."
      ],
      [
        "Where is Root Guard most appropriate?",
        [
          "On an endpoint port where a PC may send BPDUs",
          "On a routed interface with no Layer 2 switching",
          "On a port where a downstream switch must not become the root",
          "On every root port to speed convergence"
        ],
        [
          2
        ],
        "Root Guard is placed on designated ports toward downstream switches to preserve the intended root location."
      ],
      [
        "Which command displays spanning-tree details for VLAN 10 on a Cisco switch?",
        [
          "show vlan spanning-tree 10",
          "show interfaces vlan 10 spanning",
          "show ip spanning-tree 10",
          "show spanning-tree vlan 10"
        ],
        [
          3
        ],
        "show spanning-tree vlan 10 is the IOS command to inspect that VLAN's STP topology and port details."
      ],
      [
        "An administrator needs an overview of STP mode and instances. Which command is a useful starting point?",
        [
          "show spanning-tree summary",
          "show mac address-table dynamic",
          "show ip interface brief",
          "show etherchannel summary"
        ],
        [
          0
        ],
        "show spanning-tree summary provides an overview of STP mode and instances; the other commands inspect other features."
      ],
      [
        "Which two statements about Root Guard are true?",
        [
          "It is configured on a port expected to remain designated",
          "It is designed to make an edge port forward instantly",
          "It reacts when a superior BPDU arrives on the protected port",
          "It bundles links into a logical port",
          "It replaces the root bridge election process"
        ],
        [
          0,
          2
        ],
        "Root Guard protects a designated boundary from a superior BPDU; it neither alters STP's election nor provides aggregation."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "Wireless architecture models",
    "points": [
      "An autonomous AP is configured and managed individually.",
      "A controller-based AP uses a WLC for centralized functions.",
      "Cloud-managed WLANs use a cloud service for management and policy."
    ],
    "questions": [
      [
        "Which wireless architecture generally requires each AP to be configured independently?",
        [
          "Cloud-managed AP architecture",
          "Autonomous AP architecture",
          "Controller-based lightweight AP architecture",
          "CAPWAP centralized architecture"
        ],
        [
          1
        ],
        "Autonomous APs operate independently and are managed individually; lightweight APs use centralized controller management."
      ],
      [
        "What is a typical benefit of a lightweight AP with a WLC?",
        [
          "No need for an Ethernet connection",
          "Every AP becomes a router",
          "Centralized WLAN policy and AP management",
          "Client authentication is disabled"
        ],
        [
          2
        ],
        "A WLC centralizes AP configuration and WLAN policy; it does not eliminate network connectivity or authentication."
      ],
      [
        "In a cloud-managed WLAN design, where are many management and configuration functions provided?",
        [
          "On each wireless client",
          "On the access switch's spanning-tree process",
          "Only in the AP's console cable",
          "By a cloud-based management service"
        ],
        [
          3
        ],
        "Cloud-managed designs use a cloud service for central configuration and monitoring; STP does not provide those functions."
      ],
      [
        "Which deployment is usually simplest when a small site has one AP and no controller requirement?",
        [
          "Autonomous AP",
          "WLC high availability pair",
          "CAPWAP anchor deployment",
          "Cloud-based SD-WAN gateway"
        ],
        [
          0
        ],
        "An autonomous AP can be configured as a standalone device, which can suit a small simple deployment."
      ],
      [
        "Which two statements distinguish common wireless architectures?",
        [
          "Autonomous APs can operate without a WLC",
          "Lightweight APs commonly join a WLC",
          "Cloud-managed WLANs require manual local configuration of every AP",
          "A WLC is a wireless client",
          "Autonomous APs must use CAPWAP to a controller"
        ],
        [
          0,
          1
        ],
        "Autonomous APs can function independently while lightweight APs commonly join a WLC; cloud management is centralized."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "CAPWAP and controller operations",
    "points": [
      "CAPWAP carries control and, in many designs, client data between AP and WLC.",
      "A lightweight AP discovers and joins a controller.",
      "Controller reachability, addressing, and compatibility affect AP joining."
    ],
    "questions": [
      [
        "What protocol is commonly used between a lightweight AP and a WLC?",
        [
          "SFTP",
          "CAPWAP",
          "RIP",
          "SIP"
        ],
        [
          1
        ],
        "CAPWAP provides the AP-controller control and data channel; SFTP, RIP, and SIP serve other purposes."
      ],
      [
        "A lightweight AP has power and link but does not join its WLC. Which check is a sensible first step?",
        [
          "Change the root bridge MAC address",
          "Disable DHCP on wireless clients",
          "Verify IP connectivity and controller discovery/reachability",
          "Set the radio channel to 0"
        ],
        [
          2
        ],
        "The AP must obtain network settings and discover/reach a controller before joining; radio channel changes do not solve this."
      ],
      [
        "In a centralized forwarding WLAN, where is client data commonly tunneled from the AP?",
        [
          "To a DHCP server using DNS",
          "To the spanning-tree root in a BPDU",
          "To a RADIUS server using ARP",
          "To the WLC over the CAPWAP data channel"
        ],
        [
          3
        ],
        "Centralized forwarding tunnels user data to the WLC over CAPWAP; DHCP and RADIUS do not carry ordinary client payloads."
      ],
      [
        "Which statement about CAPWAP security is accurate?",
        [
          "DTLS can protect CAPWAP control traffic",
          "CAPWAP encrypts every wired frame end to end by default",
          "CAPWAP replaces WPA on the wireless link",
          "DTLS chooses the STP root"
        ],
        [
          0
        ],
        "DTLS can protect CAPWAP control and optionally data traffic, while WPA protects the wireless client link."
      ],
      [
        "Which two conditions commonly help a lightweight AP join a WLC?",
        [
          "Working IP connectivity to the controller",
          "Compatible AP/controller software",
          "A unique root bridge on every access port",
          "A WPA3 password configured on the switch",
          "A fully utilized radio channel"
        ],
        [
          0,
          1
        ],
        "Reachability and compatible software are basic join requirements; client credentials and STP port count are not."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "AP operating modes",
    "points": [
      "Local mode serves clients and maintains a CAPWAP relationship to the controller.",
      "FlexConnect can locally switch client traffic at a branch.",
      "Monitor and sniffer modes focus on observation rather than normal client service."
    ],
    "questions": [
      [
        "Which AP mode is commonly used for normal centralized client service in a campus WLAN?",
        [
          "Sniffer",
          "Local",
          "Monitor",
          "Rogue detector"
        ],
        [
          1
        ],
        "Local mode serves clients and communicates with the WLC; monitor and sniffer modes focus on monitoring."
      ],
      [
        "A branch must keep forwarding locally switched WLAN traffic during a temporary WLC WAN outage. Which AP mode is a likely fit?",
        [
          "Local only",
          "Monitor",
          "FlexConnect",
          "Sniffer"
        ],
        [
          2
        ],
        "FlexConnect supports local switching and can continue local service during controller loss when configured; monitor mode does not serve clients."
      ],
      [
        "What is the primary role of an AP in monitor mode?",
        [
          "Provide normal client access on every radio",
          "Inspect the wired VLAN database",
          "Capture all wired frames for a packet broker",
          "Scan RF for threats and rogue devices"
        ],
        [
          3
        ],
        "Monitor mode scans for RF threats and rogue APs rather than provide normal client access."
      ],
      [
        "Which AP mode is used to capture wireless packets for analysis on a designated channel?",
        [
          "Sniffer",
          "Bridge",
          "FlexConnect",
          "Local"
        ],
        [
          0
        ],
        "Sniffer mode captures 802.11 traffic for analysis; local mode is intended for client service."
      ],
      [
        "Which two AP modes are correctly matched with a primary use?",
        [
          "FlexConnect — branch local switching",
          "Monitor — normal client forwarding",
          "Sniffer — wireless packet capture",
          "Local — dedicated rogue detection only",
          "Bridge — Ethernet cable aggregation"
        ],
        [
          0,
          2
        ],
        "FlexConnect supports branch local switching and sniffer mode captures wireless frames; monitor is the dedicated scanning mode."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "AP Ethernet and switch ports",
    "points": [
      "AP switchports may be access or trunk depending on VLAN design.",
      "One locally switched WLAN VLAN commonly uses an access port.",
      "Multiple locally switched WLAN VLANs may require a trunk."
    ],
    "questions": [
      [
        "An AP locally bridges one WLAN into VLAN 20. What switchport configuration is commonly appropriate?",
        [
          "A routed port with an IP address only",
          "An access port in VLAN 20",
          "A trunk allowing no VLANs",
          "A port-channel with no members"
        ],
        [
          1
        ],
        "A single locally bridged WLAN VLAN commonly uses an access port assigned to that VLAN."
      ],
      [
        "An AP locally switches several WLANs mapped to different VLANs. What switchport type is commonly needed?",
        [
          "A routed access port",
          "A SPAN destination port",
          "A trunk carrying the required VLANs",
          "A shutdown port"
        ],
        [
          2
        ],
        "A trunk can carry multiple tagged WLAN VLANs; an access port normally carries one data VLAN."
      ],
      [
        "What does PoE provide to a compatible AP over its Ethernet cable?",
        [
          "A CAPWAP controller address",
          "An RF channel plan",
          "A WPA preshared key",
          "Electrical power"
        ],
        [
          3
        ],
        "Power over Ethernet supplies electrical power to the AP; it does not provide WLAN configuration by itself."
      ],
      [
        "For a centrally tunneled WLAN where only AP management is locally untagged, which switchport is a common starting point?",
        [
          "Access port in the AP management VLAN",
          "Trunk with every network VLAN",
          "Routed port with DHCP disabled",
          "Inter-switch trunk with PortFast"
        ],
        [
          0
        ],
        "A centrally tunneled AP may need only its management VLAN locally, so an access port is common; exact designs can vary."
      ],
      [
        "Which two statements about AP switch connections are correct?",
        [
          "PoE may power an AP",
          "A trunk may be needed for multiple locally switched WLAN VLANs",
          "Every AP must use a routed port",
          "A secure trunk always carries every VLAN",
          "An access port cannot carry AP management"
        ],
        [
          0,
          1
        ],
        "PoE can power an AP and a trunk can carry multiple local WLAN VLANs; port choice depends on the design."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "WLC physical ports and LAG",
    "points": [
      "WLCs may distinguish management, service, and distribution connections.",
      "The management interface commonly supports AP and administrator communication.",
      "LAG combines physical links into a logical connection when supported."
    ],
    "questions": [
      [
        "On a controller, which interface is commonly used for AP management traffic and administrator access?",
        [
          "Service-port console",
          "Management interface",
          "Radio interface",
          "Distribution-only port"
        ],
        [
          1
        ],
        "The management interface commonly carries control and management communication; a service port is often out-of-band."
      ],
      [
        "What is the main purpose of a WLC service port on platforms that provide one?",
        [
          "Carrying all client radio frames over the air",
          "Electing a spanning-tree root",
          "Out-of-band management or service access",
          "Supplying PoE to APs"
        ],
        [
          2
        ],
        "A service port is typically intended for out-of-band service access, not wireless client forwarding or AP power."
      ],
      [
        "What does Link Aggregation (LAG) provide when supported and configured on a WLC?",
        [
          "Encrypts the WLAN PSK",
          "Creates one WLAN per physical port",
          "Converts CAPWAP into STP",
          "Combines physical Ethernet links into a logical connection"
        ],
        [
          3
        ],
        "LAG logically bundles links for capacity and resilience; it does not perform WLAN encryption or change CAPWAP."
      ],
      [
        "When configuring a WLC LAG, what should be matched on the connected switch?",
        [
          "A compatible EtherChannel configuration on the connected ports",
          "PortFast on every switch-to-switch path",
          "A different native VLAN on every member",
          "Different speed and duplex on each member"
        ],
        [
          0
        ],
        "The switch-side bundle must be compatible with the WLC LAG requirements; inconsistent member settings can prevent bundling."
      ],
      [
        "Which two statements about WLC connectivity are generally true?",
        [
          "A management interface is used for controller management functions",
          "A service port may offer out-of-band access",
          "A distribution port is an RF antenna connector",
          "LAG members must be configured incompatibly",
          "Every WLC interface must share one VLAN"
        ],
        [
          0,
          1
        ],
        "Management and service ports have distinct roles; LAG and interface VLAN designs must follow platform requirements."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "WLAN creation in the WLC GUI",
    "points": [
      "A WLAN profile maps an SSID to WLAN settings and policy.",
      "Enable a WLAN after defining its SSID and security settings.",
      "Security and authentication must match client capabilities."
    ],
    "questions": [
      [
        "In a WLC GUI, which setting identifies the network name that wireless clients see?",
        [
          "Bridge ID",
          "SSID",
          "CAPWAP MTU",
          "Port priority"
        ],
        [
          1
        ],
        "The SSID is the advertised WLAN name; a Bridge ID is used by spanning tree."
      ],
      [
        "After creating a WLAN profile with an SSID and security policy, what must an administrator typically do for clients to use it?",
        [
          "Set it as the STP root",
          "Disable its radio interface",
          "Enable the WLAN",
          "Convert management to a routed port"
        ],
        [
          2
        ],
        "A configured WLAN often remains disabled until explicitly enabled; STP root selection is unrelated."
      ],
      [
        "What is the relationship between a WLAN profile and an SSID on a controller?",
        [
          "The SSID defines the switch native VLAN",
          "The profile replaces the AP Ethernet interface",
          "The SSID is the WLC service-port address",
          "The profile defines WLAN settings and advertises its configured SSID"
        ],
        [
          3
        ],
        "A WLAN profile contains settings such as SSID, security, and policy; VLAN assignment is configured separately."
      ],
      [
        "An administrator changes a WLAN from personal PSK to enterprise 802.1X. What additional configuration is generally required?",
        [
          "Configure an authentication server such as RADIUS",
          "Configure spanning-tree root guard",
          "Assign an AP radio channel of 0",
          "Set the SSID equal to a VLAN number"
        ],
        [
          0
        ],
        "Enterprise 802.1X generally relies on an authentication server such as RADIUS; a PSK is not the enterprise method."
      ],
      [
        "Which WLC setting directly specifies the network name presented to wireless clients?",
        [
          "Bridge ID",
          "SSID",
          "CAPWAP MTU",
          "Port priority"
        ],
        [
          1
        ],
        "The SSID is the WLAN name presented to clients; Bridge ID and port priority are spanning-tree values."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "PSK and 802.1X authentication",
    "points": [
      "Personal WLAN security commonly uses a shared passphrase.",
      "Enterprise WLAN security uses 802.1X and commonly RADIUS.",
      "WPA-Personal and WPA-Enterprise use different credential models."
    ],
    "questions": [
      [
        "Which authentication method is commonly used for a personal WLAN with one shared credential?",
        [
          "802.1X with individual accounts",
          "CAPWAP control authentication",
          "WPA2-PSK",
          "STP port authentication"
        ],
        [
          2
        ],
        "A preshared key is a shared credential suited to personal WLANs; 802.1X uses per-user or per-device authentication."
      ],
      [
        "Which component commonly validates credentials for an enterprise 802.1X WLAN?",
        [
          "A DHCP relay only",
          "The STP root bridge",
          "A channel scanner",
          "A RADIUS server"
        ],
        [
          3
        ],
        "Enterprise 802.1X commonly uses RADIUS for authentication and policy; DHCP does not validate user credentials."
      ],
      [
        "A company wants each employee to use an individual identity rather than a shared Wi-Fi password. Which design is most appropriate?",
        [
          "WPA-Enterprise using 802.1X",
          "Open authentication",
          "WPA-Personal with one passphrase",
          "Static WEP with a common key"
        ],
        [
          0
        ],
        "802.1X enterprise security supports individual credentials; a shared PSK is less suitable for per-user identity."
      ],
      [
        "Which statement best distinguishes WPA-Personal from WPA-Enterprise?",
        [
          "Personal requires RADIUS; Enterprise uses one shared key",
          "Personal uses a shared PSK; Enterprise uses 802.1X authentication",
          "Personal is for wired ports; Enterprise is for STP trunks",
          "Personal uses no encryption; Enterprise requires WEP"
        ],
        [
          1
        ],
        "Personal mode uses a shared PSK, whereas Enterprise mode uses 802.1X; neither definition requires WEP."
      ],
      [
        "Which method is used by enterprise WLANs to authenticate users through a RADIUS server?",
        [
          "WPA-Personal shared PSK",
          "Open authentication",
          "802.1X",
          "Static WEP"
        ],
        [
          2
        ],
        "Enterprise WLANs use 802.1X with RADIUS; a shared PSK is the personal-mode credential model."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "QoS and WLAN VLAN mapping",
    "points": [
      "WLAN QoS profiles control wireless traffic treatment.",
      "Common labels include Platinum, Gold, Silver, and Bronze.",
      "WLAN-to-VLAN mapping determines Layer 2 client placement."
    ],
    "questions": [
      [
        "What does a WLAN QoS profile primarily influence?",
        [
          "The AP Bridge ID",
          "The SSID character set",
          "The WLC physical port count",
          "Traffic priority and service treatment"
        ],
        [
          3
        ],
        "QoS profiles influence traffic handling and priority; they do not set spanning-tree identity or SSID spelling."
      ],
      [
        "Which common Cisco WLAN QoS profile is intended for voice traffic with the highest priority?",
        [
          "Platinum",
          "Bronze",
          "Silver",
          "Gold"
        ],
        [
          0
        ],
        "Platinum is commonly associated with voice; the other named profiles typically have lower priority."
      ],
      [
        "What is the purpose of mapping a WLAN to VLAN 40 on a WLC?",
        [
          "Make VLAN 40 the root bridge",
          "Place WLAN client traffic into the corresponding network segment",
          "Set WPA cipher to AES",
          "Assign the AP a radio channel"
        ],
        [
          1
        ],
        "VLAN mapping places client traffic in a Layer 2 segment; it does not set encryption or determine the root bridge."
      ],
      [
        "A WLAN should use an existing employee subnet and gateway. Which configuration item most directly associates clients with that subnet at Layer 2?",
        [
          "WLAN QoS profile",
          "AP sniffer mode",
          "WLAN-to-VLAN or interface mapping",
          "STP hello timer"
        ],
        [
          2
        ],
        "The WLAN's interface or VLAN mapping connects client traffic to the intended network; QoS and STP timers do not."
      ],
      [
        "Which WLAN setting directly controls the traffic priority treatment applied by the controller?",
        [
          "VLAN mapping",
          "STP root MAC address",
          "CAPWAP discovery interval",
          "QoS profile",
          "Switch console password"
        ],
        [
          3
        ],
        "The WLAN QoS profile controls traffic treatment; VLAN mapping selects client Layer 2 placement."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "WLC management access",
    "points": [
      "Management access should be restricted to authorized administrators.",
      "Reachability depends on correct interface, VLAN, IP, and routing.",
      "Use secure management protocols and limit source networks."
    ],
    "questions": [
      [
        "Which protocol is preferable for encrypted command-line administration of a WLC?",
        [
          "SSH",
          "Telnet",
          "TFTP",
          "HTTP without TLS"
        ],
        [
          0
        ],
        "SSH encrypts the management session; Telnet and clear-text HTTP expose credentials and commands."
      ],
      [
        "An administrator cannot reach the WLC GUI from the management subnet. What should be verified first?",
        [
          "The AP sniffer capture channel",
          "Management IP, VLAN, gateway, and routing",
          "The workstation STP root port",
          "The WLAN QoS profile name"
        ],
        [
          1
        ],
        "The GUI requires IP reachability to the management address; RF capture and QoS labels do not establish that path."
      ],
      [
        "Why is restricting WLC management access to administrator networks a good practice?",
        [
          "It improves radio transmit power",
          "It forces clients to roam faster",
          "It reduces exposure of the control plane",
          "It changes WPA2 to WPA3"
        ],
        [
          2
        ],
        "Limiting management-plane reachability reduces unauthorized access risk; it does not alter RF behavior or security mode."
      ],
      [
        "Which service is typically used by administrators to access a controller's web-based management interface securely?",
        [
          "LLDP",
          "CAPWAP data only",
          "802.1D",
          "HTTPS"
        ],
        [
          3
        ],
        "HTTPS provides secure browser-based administration; LLDP and STP are not GUI access protocols."
      ],
      [
        "Which action specifically limits the network sources allowed to reach a WLC management interface?",
        [
          "Permit only trusted administrator subnets",
          "Set the WLAN QoS profile to Platinum",
          "Use WPA3-Personal on the guest SSID",
          "Enable AP sniffer mode"
        ],
        [
          0
        ],
        "Restricting permitted source subnets limits management reachability; WLAN QoS and AP mode do not enforce that access boundary."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "Wireless client roaming",
    "points": [
      "Roaming occurs when a client moves between AP coverage areas.",
      "Clients generally make the roam decision using signal and other criteria.",
      "Consistent security and overlapping coverage support roaming."
    ],
    "questions": [
      [
        "What does wireless roaming describe?",
        [
          "A WLC changing its management IP",
          "A client moving its association from one AP to another",
          "An AP switching from trunk to access mode",
          "A switch electing a new root bridge"
        ],
        [
          1
        ],
        "Roaming is a client transition between APs, usually while maintaining WLAN connectivity; STP root changes are unrelated."
      ],
      [
        "What is commonly required for a smooth roam between APs in the same WLAN?",
        [
          "Different VLAN and unrelated authentication policy at every AP",
          "A unique WPA cipher on each AP",
          "Compatible SSID and security configuration",
          "A different IP subnet for each radio"
        ],
        [
          2
        ],
        "Consistent SSID and security allow the client to join another AP in the same WLAN; inconsistent policies can interrupt service."
      ],
      [
        "Which standard amendment is associated with fast BSS transition to reduce roaming delay?",
        [
          "802.1D",
          "802.3af",
          "802.1Q",
          "802.11r"
        ],
        [
          3
        ],
        "802.11r supports fast BSS transition; 802.1D is STP and 802.1Q is VLAN tagging."
      ],
      [
        "Who typically decides when a client should roam to another AP?",
        [
          "The wireless client, using received conditions and its roaming logic",
          "The root bridge based on STP path cost",
          "The DHCP server by changing the SSID",
          "The switch by disabling the AP port"
        ],
        [
          0
        ],
        "The client usually decides based on RF and implementation-specific criteria; STP does not decide when a client roams."
      ],
      [
        "Which amendment is associated with Fast BSS Transition to reduce authentication delay during roaming?",
        [
          "802.1D",
          "802.11r",
          "802.3af",
          "802.1Q"
        ],
        [
          1
        ],
        "802.11r supports Fast BSS Transition; the other standards refer to spanning tree, PoE, and VLAN tagging."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "WPA generations and encryption",
    "points": [
      "WPA2 commonly uses AES with CCMP.",
      "WPA3-Personal uses SAE instead of the traditional PSK handshake approach.",
      "TKIP is legacy; authentication method and cipher suite are distinct."
    ],
    "questions": [
      [
        "Which encryption suite is commonly associated with WPA2 for modern WLAN security?",
        [
          "DES-CBC",
          "TKIP-only",
          "AES-CCMP",
          "WEP-40"
        ],
        [
          2
        ],
        "WPA2 commonly uses AES-CCMP; WEP and TKIP are legacy options and DES-CBC is not the standard WLAN suite."
      ],
      [
        "Which personal-mode authentication mechanism is introduced by WPA3-Personal?",
        [
          "PAP",
          "CHAP",
          "EAP-MD5 only",
          "SAE"
        ],
        [
          3
        ],
        "WPA3-Personal uses SAE, improving resistance to offline password guessing compared with the older PSK exchange."
      ],
      [
        "Which choice should be avoided for a new WLAN because it is a legacy encryption protocol?",
        [
          "TKIP",
          "AES-CCMP",
          "GCMP",
          "SAE"
        ],
        [
          0
        ],
        "TKIP is deprecated legacy protection; AES-CCMP and GCMP are modern cipher suites, while SAE is authentication."
      ],
      [
        "What does CCMP provide in a WPA2 WLAN?",
        [
          "Dynamic VLAN assignment from DHCP",
          "Data confidentiality and integrity using AES-based protection",
          "AP discovery through CAPWAP",
          "Root bridge election between controllers"
        ],
        [
          1
        ],
        "CCMP is AES-based data protection providing confidentiality and integrity; CAPWAP and STP serve different functions."
      ],
      [
        "Which authentication mechanism is used by WPA3-Personal?",
        [
          "PAP",
          "CHAP",
          "SAE",
          "EAP-MD5 only"
        ],
        [
          2
        ],
        "WPA3-Personal uses SAE; CCMP is a data cipher and the other choices are not the WPA3-Personal mechanism."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "WPA2/WPA3 deployment choices",
    "points": [
      "Personal and enterprise modes address different credential models.",
      "Transition modes may support compatible older clients.",
      "Clients and APs must support selected security features."
    ],
    "questions": [
      [
        "A home office has few trusted users and no RADIUS service. Which security mode is practical?",
        [
          "Open WLAN with hidden SSID only",
          "WPA-Enterprise without an authentication server",
          "WEP with a long key",
          "WPA3-Personal with a strong passphrase, if supported"
        ],
        [
          3
        ],
        "WPA3-Personal suits a small deployment when clients support it; hiding an SSID and WEP are not adequate security."
      ],
      [
        "An organization needs individual user authentication and centralized credential policy. Which approach is best suited?",
        [
          "WPA-Enterprise with 802.1X",
          "WPA-Personal shared key",
          "Open authentication plus MAC filtering only",
          "WEP with rotating keys"
        ],
        [
          0
        ],
        "Enterprise 802.1X provides per-user credentials and centralized policy; shared keys do not provide the same identity model."
      ],
      [
        "What is a reason to use WPA2/WPA3 transition mode when the platform supports it?",
        [
          "Make every client use WEP",
          "Allow compatible WPA2 clients while newer clients use WPA3",
          "Disable authentication for legacy devices",
          "Prevent all clients from roaming"
        ],
        [
          1
        ],
        "Transition mode can support older WPA2-capable devices while newer clients use WPA3; it does not require WEP."
      ],
      [
        "Before enabling WPA3-only operation on an SSID, what should an administrator verify?",
        [
          "That every access switch uses STP 802.1D",
          "That the VLAN number matches the channel number",
          "Client and infrastructure compatibility",
          "That the SSID is hidden"
        ],
        [
          2
        ],
        "WPA3-only operation requires compatible clients and AP/controller software; hiding an SSID does not provide compatibility."
      ],
      [
        "Before enabling WPA3-only on an SSID, what should an administrator confirm?",
        [
          "That the VLAN number matches the RF channel",
          "That the SSID is hidden",
          "That every switch uses STP 802.1D",
          "That clients and infrastructure support WPA3"
        ],
        [
          3
        ],
        "WPA3-only requires compatible clients and AP/controller software; hiding an SSID does not add compatibility."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "Wireless configuration and verification",
    "points": [
      "Verify WLAN status, AP association, and client authentication separately.",
      "Use controller and switch commands to isolate the failing layer.",
      "Check VLAN and DHCP reachability after successful association."
    ],
    "questions": [
      [
        "A client associates to an SSID but does not receive an IP address. Which area should be checked next?",
        [
          "DHCP reachability and WLAN VLAN mapping",
          "STP bridge priority on the client",
          "AP sniffer capture password",
          "SSID capitalization on the gateway"
        ],
        [
          0
        ],
        "Association has succeeded, so check client VLAN placement and DHCP path; STP bridge priority on a client is irrelevant."
      ],
      [
        "An AP is powered and reachable but missing from the controller's AP list. What should be investigated?",
        [
          "The client PC default gateway",
          "CAPWAP discovery, controller reachability, and join status",
          "WPA personal passphrase rotation",
          "Core OSPF neighbor count"
        ],
        [
          1
        ],
        "AP discovery and CAPWAP join connectivity are directly relevant; client addressing is not the first AP join check."
      ],
      [
        "Which command displays switchport mode, access VLAN, and trunk details for interfaces?",
        [
          "show ip protocols",
          "show wireless client summary",
          "show interfaces switchport",
          "show spanning-tree root only"
        ],
        [
          2
        ],
        "show interfaces switchport reports Layer 2 access/trunk details; the other commands do not show those properties."
      ],
      [
        "A WLAN is enabled, but clients fail authentication. Which configuration should be verified?",
        [
          "Switch root port cost only",
          "AP management cable color",
          "DHCP lease duration only",
          "Security mode, client credentials, and RADIUS reachability for 802.1X"
        ],
        [
          3
        ],
        "Authentication failures point to security mode and credentials, and enterprise WLANs need reachable RADIUS; DHCP occurs later."
      ],
      [
        "A client has associated successfully but receives no IP address. Which issue should be checked first?",
        [
          "Client VLAN mapping and DHCP reachability",
          "The client's STP bridge priority",
          "The AP sniffer capture filter",
          "The WLC's console baud rate"
        ],
        [
          0
        ],
        "Check the WLAN VLAN and DHCP path after association; client STP priority and console settings do not assign addresses."
      ]
    ]
  },
  {
    "domain": "network-access",
    "title": "STP and WLAN design integration",
    "points": [
      "Redundant switch links require loop prevention and an intentional root.",
      "Keep edge protections on endpoint-facing ports and align trunks with VLAN needs.",
      "Separate wireless authentication issues from wired switching failures."
    ],
    "questions": [
      [
        "A campus has redundant Layer 2 uplinks carrying an AP client VLAN. What feature prevents a forwarding loop?",
        [
          "WPA3-SAE",
          "STP",
          "CAPWAP",
          "RADIUS accounting"
        ],
        [
          1
        ],
        "STP prevents Layer 2 loops across redundant links; WLAN authentication protocols do not control wired loop topology."
      ],
      [
        "An AP locally switches employee and guest WLANs into different VLANs. What should be checked on its switch connection?",
        [
          "That the port is routed",
          "That the switch root has a WPA key",
          "That the trunk carries both required VLANs",
          "That BPDU Guard is enabled on an inter-switch trunk"
        ],
        [
          2
        ],
        "Locally switched WLANs mapped to separate VLANs require those VLANs on the AP link, commonly as a trunk."
      ],
      [
        "A WLAN authenticates successfully, but only one AP's clients lose gateway access. Which local item is a useful check?",
        [
          "Wireless client's STP bridge priority",
          "WLC SSID spelling on every client",
          "Root bridge console baud rate",
          "AP switchport VLAN configuration and uplink state"
        ],
        [
          3
        ],
        "A site-specific wired path issue suggests checking the AP switchport VLAN and uplink; client STP priority is irrelevant."
      ],
      [
        "Why should the STP root for client VLANs be placed deliberately in a campus design?",
        [
          "To make Layer 2 paths predictable and reduce suboptimal traffic flow",
          "To select the WPA cipher",
          "To assign each client a unique SSID",
          "To determine legal AP modes"
        ],
        [
          0
        ],
        "Intentional root placement guides predictable Layer 2 paths; it does not control WLAN security or AP mode."
      ],
      [
        "Which feature prevents Layer 2 loops across redundant campus switch links?",
        [
          "WPA3-SAE",
          "STP",
          "CAPWAP",
          "RADIUS accounting"
        ],
        [
          1
        ],
        "STP prevents Layer 2 loops on redundant links; WLAN authentication and AP-controller protocols serve other roles."
      ]
    ]
  }

);
