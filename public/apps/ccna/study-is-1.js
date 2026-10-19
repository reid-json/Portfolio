studyTopics.push(...[

  {
    "domain": "ip-services",
    "title": "NAT Address Roles",
    "points": [
      "Inside local is an inside host's original address.",
      "Inside global is its translated identity on outside networks.",
      "Outside global is an external host's address on its own network; outside local is its inside representation.",
      "NAT address translation is distinct from firewall policy."
    ],
    "questions": [
      [
        "A host uses 10.1.1.25 inside and appears as 198.51.100.25 outside. Which is its inside local address?",
        [
          "The router WAN address",
          "198.51.100.25",
          "10.1.1.25",
          "The remote server address"
        ],
        [
          2
        ],
        "Inside local is the address assigned to the inside host before translation. The public translated address is inside global."
      ],
      [
        "Which term names the translated address representing an inside host to outside networks?",
        [
          "Outside local",
          "Inside global",
          "Outside global",
          "Inside local"
        ],
        [
          1
        ],
        "Inside global is the address outsiders see for an inside host. Inside local is the host's original address."
      ],
      [
        "A remote server is 203.0.113.80 publicly and appears as 172.20.5.80 inside. What is 203.0.113.80?",
        [
          "Outside global",
          "Inside local",
          "Inside global",
          "Outside local"
        ],
        [
          0
        ],
        "Outside global is the external host's address on its own network. Its inside representation is outside local."
      ],
      [
        "An external host's public address 203.0.113.80 is represented inside as 172.20.5.80. What is 172.20.5.80?",
        [
          "Outside local",
          "Inside global",
          "Outside global",
          "Inside local"
        ],
        [
          0
        ],
        "Outside local names how an outside host is represented on the inside network. Its public address is outside global."
      ],
      [
        "For an inside host's outbound packet, which pair identifies its address before and after NAT?",
        [
          "Inside local, then inside global",
          "Outside local, then outside global",
          "Inside global, then outside global",
          "Outside global, then inside local"
        ],
        [
          0
        ],
        "The inside host begins with an inside local address and is represented externally by its inside global address. Outside terms describe the remote host."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "NAT Static and Interface Configuration",
    "points": [
      "Static NAT maps one inside local address consistently to an inside global address.",
      "The static inside-source command lists local address before global address.",
      "Configure ip nat inside on the LAN side and ip nat outside on the WAN side.",
      "A stable public mapping is useful when an inside service must be reachable."
    ],
    "questions": [
      [
        "Which command statically maps inside host 192.168.10.20 to 198.51.100.20?",
        [
          "ip nat inside source static 192.168.10.20 198.51.100.20",
          "ip nat outside source static 192.168.10.20 198.51.100.20",
          "ip nat inside source dynamic 198.51.100.20 192.168.10.20",
          "ip nat pool 192.168.10.20 198.51.100.20"
        ],
        [
          0
        ],
        "The inside source static form maps inside local first to inside global second. Outside-source commands translate external addresses."
      ],
      [
        "Where is ip nat inside normally configured?",
        [
          "On the ISP-facing interface",
          "On every routed interface",
          "On the LAN-facing interface",
          "On the DHCP pool"
        ],
        [
          2
        ],
        "The LAN interface is marked inside so NAT can identify the internal side. The WAN interface is marked outside."
      ],
      [
        "Which interface command marks a WAN link as the external NAT boundary?",
        [
          "ip nat outside",
          "ip nat source outside",
          "ip nat enable outside",
          "ip nat inside"
        ],
        [
          0
        ],
        "ip nat outside is the IOS interface command for the external side. ip nat inside marks an internal-facing interface."
      ],
      [
        "What is needed alongside a static mapping to identify the translation boundary?",
        [
          "ip nat inside and ip nat outside on correct interfaces",
          "A DNS MX record",
          "A routing protocol on every host",
          "A DHCP pool on the WAN"
        ],
        [
          0
        ],
        "NAT must identify inside and outside interfaces as well as define a mapping. DHCP and DNS do not establish NAT roles."
      ],
      [
        "In ip nat inside source static 192.168.10.20 198.51.100.20, which address is first?",
        [
          "Inside global",
          "Outside global",
          "Inside local",
          "Outside local"
        ],
        [
          2
        ],
        "The first value is the inside local address; the second is the inside global address. Reversing them changes the mapping."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "Dynamic NAT Pools and PAT",
    "points": [
      "Dynamic NAT assigns eligible inside hosts addresses from a configured pool.",
      "An ACL commonly selects inside local addresses; ip nat inside source list links it to a pool.",
      "PAT overload shares an address by tracking transport-layer ports.",
      "The overload keyword enables port address translation."
    ],
    "questions": [
      [
        "How does dynamic NAT differ from PAT overload?",
        [
          "Dynamic NAT encrypts packets; PAT does not.",
          "Dynamic NAT assigns pool addresses; PAT multiplexes sessions with ports.",
          "Dynamic NAT changes MAC addresses; PAT changes routes.",
          "Dynamic NAT is inbound only; PAT is outbound only."
        ],
        [
          1
        ],
        "Dynamic NAT allocates addresses from a pool, while PAT shares addresses using port information. Neither encrypts traffic."
      ],
      [
        "Which keyword enables many inside hosts to share one public address through port translations?",
        [
          "static",
          "overload",
          "pool",
          "permit"
        ],
        [
          1
        ],
        "overload enables PAT so sessions can share an address. pool identifies an address range, not port sharing by itself."
      ],
      [
        "Which command defines pool PUBLIC from 198.51.100.10 through .20 with a /24 mask?",
        [
          "ip nat pool PUBLIC 198.51.100.10 198.51.100.20 netmask 255.255.255.0",
          "ip nat inside source pool PUBLIC 198.51.100.10 198.51.100.20",
          "ip nat pool PUBLIC 198.51.100.10/24 198.51.100.20/24",
          "ip nat outside pool PUBLIC 198.51.100.10 198.51.100.20"
        ],
        [
          0
        ],
        "ip nat pool specifies a name, start and end addresses, and netmask. A separate inside-source command associates the pool with selected traffic."
      ],
      [
        "Which command links ACL 10 and pool PUBLIC for dynamic NAT without overload?",
        [
          "ip nat inside source list 10 pool PUBLIC",
          "ip nat inside source list 10 interface PUBLIC overload",
          "ip nat outside source list 10 pool PUBLIC",
          "ip nat inside pool PUBLIC list 10 overload"
        ],
        [
          0
        ],
        "The inside source list and pool form associates ACL 10 with PUBLIC. Adding overload would enable PAT instead of simple dynamic allocation."
      ],
      [
        "How does PAT distinguish concurrent flows using the same translated IPv4 address?",
        [
          "It requires one public address per inside host.",
          "It assigns each flow a dedicated physical interface.",
          "It replaces destination MAC addresses with public addresses.",
          "It tracks transport-layer port information with the address."
        ],
        [
          3
        ],
        "PAT tracks transport ports with translations so multiple flows can share an address. It does not require a unique public address for each host."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "NAT Verification and Troubleshooting",
    "points": [
      "show ip nat translations lists current and configured mappings.",
      "show ip nat statistics reports counters and inside/outside interface roles.",
      "Check interface labels, ACL matches, pool capacity, and routing when translations fail.",
      "An empty dynamic table may simply mean no matching traffic has passed."
    ],
    "questions": [
      [
        "Which command displays active NAT translation entries?",
        [
          "show ip route nat",
          "show ip interface nat",
          "show ip nat translations",
          "show ip access-lists nat"
        ],
        [
          2
        ],
        "show ip nat translations lists active and static entries. NAT counters and interface roles appear in the statistics view."
      ],
      [
        "Which command displays NAT counters and configured inside/outside interfaces?",
        [
          "show ip nat statistics",
          "show ip protocols",
          "show ip nat translations",
          "show ip interface brief"
        ],
        [
          0
        ],
        "show ip nat statistics provides counters and NAT interface information. translations shows individual mapping entries."
      ],
      [
        "A pool exists but no dynamic translation appears. What is a direct initial check?",
        [
          "Check that test traffic matches the NAT ACL and crosses inside/outside interfaces.",
          "Change the router's NTP stratum.",
          "Enable DNS recursion on the ISP.",
          "Set syslog severity to emergencies."
        ],
        [
          0
        ],
        "Traffic must match the selection ACL and traverse interfaces marked inside and outside. NTP and syslog settings do not create translations."
      ],
      [
        "No NAT entries appear and the LAN interface lacks a NAT role. What should be done?",
        [
          "Apply ip nat outside on the LAN only.",
          "Add overload to the DHCP pool.",
          "Apply ip nat inside on the LAN-facing interface.",
          "Configure a DNS A record."
        ],
        [
          2
        ],
        "The LAN interface must be marked inside. Marking it outside would invert the intended boundary."
      ],
      [
        "What can happen when every address in a dynamic NAT pool is allocated?",
        [
          "Hosts automatically obtain an NTP server address.",
          "New eligible hosts may not receive translations until an address is free.",
          "The router converts traffic to IPv6.",
          "DNS MX records supply new translations."
        ],
        [
          1
        ],
        "A new dynamic mapping needs an available global address unless another translation method is configured. DNS and NTP do not extend the pool."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "DHCP Operation and DORA",
    "points": [
      "DHCP supplies host addressing parameters such as address, mask, gateway, and DNS server.",
      "DORA means Discover, Offer, Request, Acknowledgment.",
      "A lease grants address use for a limited period and is renewed by the client.",
      "A client initially broadcasts because it may not know its subnet or server."
    ],
    "questions": [
      [
        "Which sequence correctly gives the common DHCP lease exchange?",
        [
          "Offer, Request, Discover, Acknowledgment",
          "Request, Discover, Acknowledgment, Offer",
          "Discover, Offer, Request, Acknowledgment",
          "Discover, Request, Offer, Acknowledgment"
        ],
        [
          2
        ],
        "DORA is Discover, Offer, Request, and Acknowledgment. A client discovers servers before requesting an offered lease."
      ],
      [
        "What does a DHCP lease timer determine?",
        [
          "The NAT translation timeout only.",
          "How long an assigned address may be used before renewal is needed.",
          "The DHCP server's NTP stratum.",
          "The number of DNS records a client may cache."
        ],
        [
          1
        ],
        "A lease limits the duration of an address assignment and triggers renewal. It does not control NAT, NTP, or DNS caching."
      ],
      [
        "Which message does a client send to locate available DHCP servers?",
        [
          "Offer",
          "Request",
          "Acknowledgment",
          "Discover"
        ],
        [
          3
        ],
        "Discover is the initial client message used to find servers. An Offer is sent by a server in response."
      ],
      [
        "Which DHCP message carries the server's proposed address and options to a client?",
        [
          "Offer",
          "Request",
          "Acknowledgment",
          "Discover"
        ],
        [
          0
        ],
        "The server sends an Offer with proposed configuration. Acknowledgment confirms an accepted request."
      ],
      [
        "What does a DHCP acknowledgment generally confirm?",
        [
          "The client must configure a static address.",
          "The client is now a DNS forwarder.",
          "The requested lease and options have been accepted.",
          "The DHCP server is the client's gateway."
        ],
        [
          2
        ],
        "The acknowledgment confirms the lease and supplied options. It does not change the server into the client's gateway or DNS forwarder."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "IOS DHCP Server Configuration",
    "points": [
      "ip dhcp excluded-address reserves addresses from allocation.",
      "ip dhcp pool name creates a pool; network defines its subnet and mask.",
      "Use default-router and dns-server to provide common client options.",
      "show ip dhcp binding lists leases; ip address dhcp makes an interface a client."
    ],
    "questions": [
      [
        "Which command excludes 192.168.1.1 through 192.168.1.20 from IOS DHCP allocation?",
        [
          "ip dhcp pool excluded 192.168.1.1 192.168.1.20",
          "ip dhcp excluded-address 192.168.1.1 192.168.1.20",
          "ip address excluded 192.168.1.1 192.168.1.20",
          "ip dhcp reserve 192.168.1.1-192.168.1.20"
        ],
        [
          1
        ],
        "ip dhcp excluded-address takes the first and last addresses of the reserved range. A pool is configured separately."
      ],
      [
        "Which command enters configuration for a DHCP pool named USERS?",
        [
          "dhcp pool USERS",
          "ip pool dhcp USERS",
          "ip dhcp pool USERS",
          "service dhcp pool USERS"
        ],
        [
          2
        ],
        "The IOS global command is ip dhcp pool USERS. The other spellings are not valid pool commands."
      ],
      [
        "Inside the pool, which command specifies subnet 192.168.1.0/24?",
        [
          "subnet 192.168.1.0 255.255.255.0",
          "ip address 192.168.1.0 255.255.255.0",
          "network 192.168.1.0 255.255.255.0",
          "pool network 192.168.1.0/24"
        ],
        [
          2
        ],
        "The network command defines the DHCP pool subnet and mask. ip address is an interface command, not the pool network statement."
      ],
      [
        "Which DHCP pool command gives clients 192.168.1.1 as their default gateway?",
        [
          "gateway 192.168.1.1",
          "router 192.168.1.1",
          "default-router 192.168.1.1",
          "ip helper-address 192.168.1.1"
        ],
        [
          2
        ],
        "default-router supplies the gateway option to clients. ip helper-address is an interface relay command."
      ],
      [
        "Which command makes an IOS interface request its IPv4 address from DHCP?",
        [
          "ip address automatic",
          "ip dhcp address client",
          "ip address dhcp",
          "dhcp client enable"
        ],
        [
          2
        ],
        "ip address dhcp is configured under the interface for DHCP client operation. It is distinct from creating a server pool."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "DHCP Relay and Verification",
    "points": [
      "DHCP broadcasts normally remain inside a local broadcast domain.",
      "ip helper-address under a client-facing interface relays requests to a remote server.",
      "Routing must permit request and reply traffic between the relay and server.",
      "show ip dhcp binding displays leases on an IOS DHCP server."
    ],
    "questions": [
      [
        "A DHCP server at 10.20.0.5 is remote from a client VLAN. Which command relays requests?",
        [
          "ip forward-protocol dhcp-server 10.20.0.5",
          "ip dhcp relay 10.20.0.5",
          "ip helper-address 10.20.0.5",
          "ip dhcp pool 10.20.0.5"
        ],
        [
          2
        ],
        "ip helper-address specifies the remote server for broadcasts received on that interface. The other forms are not the standard IOS relay command."
      ],
      [
        "Where should ip helper-address normally be configured for a remote client subnet?",
        [
          "Under the router interface facing those clients",
          "On the DHCP server loopback",
          "Inside the global DHCP pool",
          "On the ISP-facing interface only"
        ],
        [
          0
        ],
        "The relay receives client broadcasts on the client-facing interface, so the helper belongs there. It is not a pool subcommand."
      ],
      [
        "How does a DHCP relay enable service from another IP subnet?",
        [
          "It forwards the local request as routable traffic toward the server.",
          "It converts DHCP into DNS over TCP.",
          "It forwards the client's local broadcast unchanged through routers.",
          "It assigns a static address before forwarding."
        ],
        [
          0
        ],
        "The relay converts the local broadcast request into traffic the server can receive across routed networks. Routers do not normally forward local broadcasts unchanged."
      ],
      [
        "Which command shows leases issued by an IOS DHCP server?",
        [
          "show ip dhcp pool",
          "show ip dhcp binding",
          "show ip interface dhcp",
          "show dhcp leases"
        ],
        [
          1
        ],
        "show ip dhcp binding lists current address bindings. Pool and interface views show other information."
      ],
      [
        "A configured relay does not receive offers. Which prerequisite should be checked?",
        [
          "A static NAT entry for each client",
          "That clients and server share one physical LAN",
          "IP routing reachability between relay and DHCP server",
          "An MX record for the helper address"
        ],
        [
          2
        ],
        "The relay needs routed reachability to the server and replies must return. They need not share a LAN, and NAT or MX records are not prerequisites."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "NTP Time Synchronization",
    "points": [
      "An NTP client synchronizes its clock with a time source; servers provide time to peers.",
      "Lower stratum values are generally closer to a reference clock; stratum 1 is directly reference-clock attached.",
      "ntp server selects a source; ntp master serves the local clock as a master.",
      "show ntp status reports synchronization state and stratum."
    ],
    "questions": [
      [
        "Which IOS command configures 192.0.2.20 as a time source?",
        [
          "ntp server 192.0.2.20",
          "ntp master 192.0.2.20",
          "clock source ntp 192.0.2.20",
          "ntp peer-client 192.0.2.20"
        ],
        [
          0
        ],
        "ntp server followed by an address configures a time source. ntp master makes the local device provide its own clock."
      ],
      [
        "What does a lower NTP stratum generally indicate?",
        [
          "The device cannot serve time to any peer.",
          "The polling interval is longer by definition.",
          "The source is closer to the reference clock in the hierarchy.",
          "The source has a less accurate IP route."
        ],
        [
          2
        ],
        "Lower stratum generally indicates a time source nearer the reference clock. Stratum is not a routing metric or polling interval."
      ],
      [
        "Which command lets an IOS router serve its local clock when no external source is configured?",
        [
          "ntp server",
          "ntp enable master",
          "clock set master",
          "ntp master"
        ],
        [
          3
        ],
        "ntp master makes the router advertise its local clock as an NTP source, optionally at a specified stratum. ntp server selects a remote peer."
      ],
      [
        "Which command verifies the router's NTP synchronization state?",
        [
          "show ntp status",
          "show ntp associations",
          "show ip ntp",
          "show clock detail"
        ],
        [
          0
        ],
        "show ntp status reports synchronization and stratum. Associations can show peers, but status directly reports synchronization state."
      ],
      [
        "A router has an ntp server statement but remains unsynchronized. What is the best next interpretation?",
        [
          "A configured source does not prove synchronization; check reachability and peer state.",
          "It needs ip helper-address before NTP can work.",
          "The server must also relay DHCP.",
          "The router is synchronized because the command exists."
        ],
        [
          0
        ],
        "An NTP source command selects a peer but does not guarantee synchronization. Verify reachability, association state, and valid time source."
      ],
      [
        "Which two NTP statements are correct?",
        [
          "ntp server configures a remote time source.",
          "ntp master points the router at a DNS server.",
          "show ntp status reports synchronization information.",
          "A higher stratum is always closer to the reference.",
          "NTP requires DHCP relay on every interface."
        ],
        [
          0,
          2
        ],
        "ntp server selects a peer and show ntp status checks synchronization. ntp master serves a local clock, and lower stratum is nearer the reference."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "DNS Resolution and Records",
    "points": [
      "DNS resolves names to records; clients often query recursive resolvers.",
      "A maps names to IPv4 and AAAA maps names to IPv6.",
      "CNAME aliases a name to a canonical name; MX identifies mail exchangers.",
      "ip name-server specifies DNS servers used by the IOS device."
    ],
    "questions": [
      [
        "Which DNS record maps a host name to an IPv4 address?",
        [
          "AAAA",
          "A",
          "MX",
          "CNAME"
        ],
        [
          1
        ],
        "An A record maps a name to an IPv4 address. AAAA is used for IPv6."
      ],
      [
        "Which DNS record provides an IPv6 address for a name?",
        [
          "MX",
          "AAAA",
          "A",
          "CNAME"
        ],
        [
          1
        ],
        "AAAA records contain IPv6 address mappings. A records map names to IPv4."
      ],
      [
        "Which record creates an alias from one name to another canonical name?",
        [
          "CNAME",
          "A",
          "MX",
          "AAAA"
        ],
        [
          0
        ],
        "CNAME identifies an alias to a canonical name. MX identifies mail servers instead."
      ],
      [
        "Which DNS record identifies a domain's mail exchanger?",
        [
          "A",
          "CNAME",
          "AAAA",
          "MX"
        ],
        [
          3
        ],
        "MX records identify mail exchangers for a domain. A and AAAA map addresses, while CNAME creates an alias."
      ],
      [
        "Which IOS command sets DNS server 192.0.2.53 for router name lookups?",
        [
          "name-server ip 192.0.2.53",
          "ip dns server 192.0.2.53",
          "ip name-server 192.0.2.53",
          "dns resolver 192.0.2.53"
        ],
        [
          2
        ],
        "ip name-server configures DNS servers used by IOS name resolution. The alternate forms shown are not standard IOS syntax."
      ],
      [
        "Which two DNS record descriptions are correct?",
        [
          "A maps a name to IPv4.",
          "MX maps a name to IPv6.",
          "AAAA maps a name to IPv6.",
          "CNAME maps a name to a default gateway.",
          "A maps a name to an email exchanger."
        ],
        [
          0,
          2
        ],
        "A maps to IPv4 and AAAA to IPv6. MX identifies mail exchangers; CNAME is an alias."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "SNMP Components and Operations",
    "points": [
      "A manager communicates with agents on monitored devices.",
      "A MIB organizes managed objects and their identifiers.",
      "Polling is manager-initiated; traps are unsolicited agent notifications.",
      "v2c commonly uses community strings; v3 can provide authentication and privacy."
    ],
    "questions": [
      [
        "Which SNMP component typically initiates queries for interface counters?",
        [
          "The SNMP agent",
          "The SNMP manager",
          "The MIB",
          "The syslog collector"
        ],
        [
          1
        ],
        "The manager polls agents for managed information. The agent on a device responds to those requests."
      ],
      [
        "What is the role of an SNMP agent?",
        [
          "It encrypts all SNMP versions automatically.",
          "It converts DNS records into routes.",
          "It runs on a managed device and answers requests or sends notifications.",
          "It stores all switch configurations in a central MIB file."
        ],
        [
          2
        ],
        "An agent exposes managed objects on a device and can send notifications. Encryption depends on SNMP version and configuration."
      ],
      [
        "What information does an SNMP MIB define?",
        [
          "Only the router's routing table",
          "A shared community secret",
          "The physical cable layout",
          "Managed objects and their definitions or identifiers"
        ],
        [
          3
        ],
        "A MIB defines objects that management systems can monitor or control. It is not a community string or physical network diagram."
      ],
      [
        "Which event flow describes an SNMP trap?",
        [
          "The manager polls and the agent answers only when asked.",
          "The MIB queries the manager each second.",
          "The syslog collector polls each interface.",
          "The agent sends a notification without waiting for a poll."
        ],
        [
          3
        ],
        "A trap is an agent-initiated notification, unlike polling, which starts with a manager query."
      ],
      [
        "Which two SNMP version statements are accurate?",
        [
          "v2c commonly uses community strings.",
          "v2c encrypts all management payloads by default.",
          "v3 can provide authentication and privacy when configured.",
          "v3 replaces the manager-agent model with DNS.",
          "v3 cannot send notifications."
        ],
        [
          0,
          2
        ],
        "v2c commonly relies on community strings, while v3 can provide authentication and privacy. Both versions use manager-agent operations and support notifications."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "Syslog Severity and Destinations",
    "points": [
      "Syslog severities range from 0 emergencies to 7 debugging.",
      "Lower numbers indicate greater urgency; a threshold includes that value and more severe values.",
      "logging host address configures a remote syslog destination.",
      "Central collection helps correlate events but does not replace live troubleshooting."
    ],
    "questions": [
      [
        "Which syslog severity is the most severe?",
        [
          "0",
          "3",
          "6",
          "7"
        ],
        [
          0
        ],
        "Severity 0 is emergencies and is the most severe. Level 7 is debugging."
      ],
      [
        "What is the name of syslog severity level 7?",
        [
          "Debugging",
          "Alerts",
          "Critical",
          "Notifications"
        ],
        [
          0
        ],
        "Level 7 is debugging, the least severe level. Alert, critical, and notifications use lower numbers."
      ],
      [
        "Which IOS command sends syslog messages to 192.0.2.40?",
        [
          "logging host 192.0.2.40",
          "logging server 192.0.2.40",
          "syslog host 192.0.2.40",
          "log destination 192.0.2.40"
        ],
        [
          0
        ],
        "logging host specifies a remote syslog destination on IOS. The other listed forms are not standard syntax."
      ],
      [
        "A syslog threshold is set to level 4. Which severities are included?",
        [
          "Only level 4",
          "Levels 4 through 7",
          "Levels 0 through 4",
          "Levels 0 through 7"
        ],
        [
          2
        ],
        "A level 4 threshold includes 4 and more severe levels 0 through 3, not less severe levels 5 through 7. This item options include levels 0 through 4, which is the intended selection."
      ],
      [
        "Which order lists syslog levels from most to least severe?",
        [
          "7 through 0",
          "0 through 7",
          "4, 0, 7, 1",
          "1 through 6, then 0"
        ],
        [
          1
        ],
        "Severity descends from 0 emergencies to 7 debugging. Smaller numbers represent greater urgency."
      ],
      [
        "Which two are correct syslog facts?",
        [
          "Level 0 is emergencies.",
          "Level 7 is alerts.",
          "logging host sets a remote collector.",
          "Higher numeric levels mean greater urgency.",
          "Severity 4 includes only level 4."
        ],
        [
          0,
          2
        ],
        "Level 0 is emergencies, and logging host configures a remote destination. Higher numeric levels are less severe, and a threshold includes more severe levels too."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "QoS Classification and Traffic Classes",
    "points": [
      "QoS manages treatment of traffic during congestion; it does not add physical capacity.",
      "Classification identifies traffic by addresses, protocols, applications, or existing marks.",
      "Voice, interactive video, and data have different delay, jitter, loss, and throughput needs.",
      "Marking communicates a traffic class using values such as IP DSCP or Layer 2 CoS."
    ],
    "questions": [
      [
        "What is QoS primarily intended to do on a congested link?",
        [
          "Guarantee congestion never occurs",
          "Increase physical line rate automatically",
          "Replace routing with application switching",
          "Prioritize and manage traffic according to policy"
        ],
        [
          3
        ],
        "QoS classifies, marks, and schedules traffic so classes receive planned treatment. It cannot eliminate congestion or raise link capacity."
      ],
      [
        "Which function identifies packets so a policy can assign them different treatment?",
        [
          "Address translation",
          "Compression",
          "Fragmentation",
          "Classification"
        ],
        [
          3
        ],
        "Classification recognizes traffic using attributes such as protocol, addresses, or markings. The other actions serve different purposes."
      ],
      [
        "Which traffic is commonly most sensitive to delay and jitter?",
        [
          "Bulk file transfer",
          "Interactive voice",
          "Backups",
          "Background software updates"
        ],
        [
          1
        ],
        "Interactive voice is delay- and jitter-sensitive, so QoS often gives it low-delay treatment. Bulk data can usually tolerate more delay."
      ],
      [
        "Which pair best describes common interactive voice needs?",
        [
          "High latency and large jitter",
          "Low delay and low jitter",
          "No predictable delivery needed",
          "Unbounded loss is harmless"
        ],
        [
          1
        ],
        "Voice quality is better with low and predictable delay and jitter. QoS cannot make arbitrary delay or loss harmless."
      ],
      [
        "Which two are common packet-classification inputs?",
        [
          "Source or destination IP address",
          "NTP stratum alone",
          "Layer 4 protocol or port",
          "Router hostname only",
          "DHCP lease expiration only"
        ],
        [
          0,
          2
        ],
        "Classification commonly uses packet addresses and Layer 4 protocol or port. NTP stratum and lease timers do not describe each packet's class."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "QoS Marking and Per-Hop Behavior",
    "points": [
      "DSCP is a six-bit IP-header marking for differentiated treatment.",
      "CoS commonly means the 802.1Q Layer 2 priority value.",
      "EF is a per-hop behavior often used for low-delay voice.",
      "AF classes include drop-precedence levels; PHB describes forwarding treatment at each hop."
    ],
    "questions": [
      [
        "Where is DSCP marking carried?",
        [
          "In the Ethernet source MAC",
          "In the IP differentiated-services field",
          "In the TCP acknowledgment number",
          "In the DNS transaction identifier"
        ],
        [
          1
        ],
        "DSCP is carried in the IP header's differentiated-services field. It is not part of Ethernet MAC or TCP sequence data."
      ],
      [
        "Which marking commonly refers to 802.1Q Layer 2 priority?",
        [
          "DSCP",
          "AF",
          "EF",
          "CoS"
        ],
        [
          3
        ],
        "CoS commonly refers to the 802.1Q priority field. DSCP is an IP-layer marking."
      ],
      [
        "Which DSCP per-hop behavior is commonly chosen for low-delay voice?",
        [
          "AF11",
          "CS1",
          "Best effort",
          "EF"
        ],
        [
          3
        ],
        "EF provides expedited forwarding behavior intended for low delay, jitter, and loss. Best effort has no such priority guarantee."
      ],
      [
        "What does PHB stand for in differentiated services?",
        [
          "Port-based host bridging",
          "Priority host broadcast",
          "Packet header balancing",
          "Per-hop behavior"
        ],
        [
          3
        ],
        "PHB means per-hop behavior: the treatment a network node applies to marked packets."
      ],
      [
        "What do AF drop-precedence values distinguish?",
        [
          "DNS record type",
          "Relative likelihood of packet drop during congestion",
          "NAT pool selection",
          "A guarantee that no packet drops"
        ],
        [
          1
        ],
        "AF drop precedence indicates relative drop likelihood under congestion. It does not guarantee delivery or select a NAT pool."
      ],
      [
        "Which two statements about QoS markings are correct?",
        [
          "DSCP is carried in the IP header.",
          "CoS is the DNS mail-exchanger record.",
          "CoS commonly marks 802.1Q priority.",
          "EF is a DHCP lease option.",
          "PHB means packet host broadcast."
        ],
        [
          0,
          2
        ],
        "DSCP is an IP-layer marking and CoS commonly identifies Layer 2 priority. EF is a forwarding behavior, not a DHCP option."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "QoS Queuing, Policing, and Shaping",
    "points": [
      "Queuing schedules packets when an output is congested.",
      "Policing enforces a rate by dropping or remarking excess traffic, usually without smoothing it in a queue.",
      "Shaping buffers excess packets and releases them later to smooth an output rate.",
      "Shaping adds delay; QoS behavior should reflect class requirements and link capacity."
    ],
    "questions": [
      [
        "What does QoS queuing decide during output congestion?",
        [
          "How the physical link speed is raised",
          "How every destination IP is translated",
          "How packets are encrypted",
          "How packets are scheduled for transmission"
        ],
        [
          3
        ],
        "Queuing schedules packets under congestion and can favor selected classes. It does not perform NAT, encryption, or link upgrades."
      ],
      [
        "How does a policer commonly handle traffic exceeding its configured rate?",
        [
          "It buffers every excess packet until later.",
          "It converts them to DNS queries.",
          "It drops or remarks excess packets.",
          "It automatically increases interface speed."
        ],
        [
          2
        ],
        "Policing commonly drops or remarks excess traffic to enforce a rate. Buffering and smoothing describes shaping."
      ],
      [
        "Which mechanism buffers excess traffic and transmits it at a smoother rate?",
        [
          "Classification",
          "Shaping",
          "Policing",
          "Marking"
        ],
        [
          1
        ],
        "Shaping buffers and delays excess packets to smooth output. Policing commonly drops or remarks excess traffic."
      ],
      [
        "Bursty traffic should be held briefly instead of discarded above a target rate. Which mechanism fits?",
        [
          "Traffic shaping",
          "Packet marking alone",
          "An ACL classifier",
          "A policer without buffering"
        ],
        [
          0
        ],
        "Shaping queues bursts and releases them over time, adding delay. A policer is more likely to discard or remark excess packets."
      ],
      [
        "Which contrast between policing and shaping is correct?",
        [
          "Policing is a DNS feature; shaping is DHCP.",
          "Policing changes DSCP only; shaping changes IP addresses.",
          "Policing commonly drops or remarks excess packets; shaping buffers them and adds delay.",
          "Both always drop the same packets at the same instant."
        ],
        [
          2
        ],
        "Policing typically enforces a rate without smoothing traffic through a queue. Shaping buffers and transmits later, so their effects differ."
      ],
      [
        "Which two QoS functions directly control transmission treatment during congestion or rate excess?",
        [
          "Queuing schedules packets.",
          "DNS aliasing shapes packets.",
          "Policing may drop or remark excess traffic.",
          "NTP stratum buffers packets.",
          "DHCP leasing classifies RTP."
        ],
        [
          0,
          2
        ],
        "Queuing schedules packets and policing enforces a rate by handling excess traffic. DNS, NTP, and DHCP functions are unrelated to those QoS actions."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "QoS Trust Boundaries",
    "points": [
      "A trust boundary defines where incoming markings are accepted or reset.",
      "A network may trust a managed phone while resetting untrusted endpoint marks.",
      "Access-layer marking prevents endpoints from claiming priority without authorization.",
      "Trusted marking alone reserves no bandwidth; queues and policies provide treatment."
    ],
    "questions": [
      [
        "What is the purpose of a QoS trust boundary?",
        [
          "Block every packet entering a VLAN",
          "Specify ownership of the default route",
          "Encrypt all traffic past a switch",
          "Define where markings are trusted or re-marked"
        ],
        [
          3
        ],
        "A trust boundary determines whether existing marks are accepted or changed. It does not define routing or encrypt traffic."
      ],
      [
        "Managed phones mark voice traffic, but PCs are untrusted. What is a sensible access switch policy?",
        [
          "Trust all endpoint marks equally.",
          "Selectively trust phone marks and reset untrusted PC marks.",
          "Disable all QoS marking.",
          "Mark all data traffic EF."
        ],
        [
          1
        ],
        "Selective trust honors managed phone markings while preventing endpoints from claiming high priority. Trusting all marks enables misuse."
      ],
      [
        "Why remark traffic from an untrusted endpoint?",
        [
          "Convert IPv4 to IPv6.",
          "Prevent endpoints from self-assigning privileged treatment outside policy.",
          "Prevent DHCP broadcasts from relaying.",
          "Give each host an NTP stratum."
        ],
        [
          1
        ],
        "Remarking enforces network classification and helps prevent misuse of priority markings. It does not change addressing or time services."
      ],
      [
        "A packet is marked EF. What else helps provide low-delay treatment during congestion?",
        [
          "A DNS CNAME",
          "A static NAT translation",
          "An NTP master setting",
          "A queue or forwarding policy implementing the desired PHB"
        ],
        [
          3
        ],
        "Marking communicates a class, but devices need appropriate queues or forwarding policy to treat it accordingly. A mark alone does not reserve bandwidth."
      ],
      [
        "Which two statements about trust boundaries are correct?",
        [
          "They determine where marks may be accepted or changed.",
          "Trusting a mark guarantees reserved bandwidth.",
          "A managed phone can be trusted while other ports are remarked.",
          "They eliminate queues during congestion.",
          "They convert CoS into DNS records."
        ],
        [
          0,
          2
        ],
        "Trust boundaries govern acceptance and remarking, and policies can trust a phone selectively. Queuing is still needed to realize congestion treatment."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "SSH and Telnet Management",
    "points": [
      "SSH encrypts remote management sessions; Telnet sends session data in clear text.",
      "A common IOS SSH setup uses a hostname, ip domain-name, local user, and RSA keys.",
      "Use transport input ssh on VTY lines and login local for local username authentication.",
      "Secure remote access also requires appropriate authentication and access restrictions."
    ],
    "questions": [
      [
        "Which protocol is appropriate for encrypted IOS command-line access?",
        [
          "Telnet",
          "SSH",
          "TFTP",
          "SNMPv1"
        ],
        [
          1
        ],
        "SSH encrypts interactive remote sessions. Telnet is clear text, and TFTP and SNMP are not interactive CLI protocols."
      ],
      [
        "What is a major Telnet weakness for administration?",
        [
          "It requires RSA keys for every session.",
          "It sends credentials and session data without encryption.",
          "It cannot carry a command line.",
          "It uses DNS instead of IP routing."
        ],
        [
          1
        ],
        "Telnet does not encrypt its session, exposing credentials and commands in transit. SSH is preferred for secure remote CLI access."
      ],
      [
        "Which VTY command allows only SSH as an inbound terminal transport?",
        [
          "ip ssh only",
          "transport output ssh",
          "transport input ssh",
          "login local ssh-only"
        ],
        [
          2
        ],
        "transport input ssh restricts inbound VTY transport to SSH. transport output affects outbound terminal connections."
      ],
      [
        "Which VTY command authenticates against locally configured usernames?",
        [
          "password local",
          "login",
          "username login",
          "login local"
        ],
        [
          3
        ],
        "login local uses the local username database. login alone uses a configured line password."
      ],
      [
        "Which two settings are commonly required before IOS can generate RSA keys for SSH?",
        [
          "A hostname",
          "A DHCP excluded range",
          "An ip domain-name value",
          "A syslog severity",
          "An MX record"
        ],
        [
          0,
          2
        ],
        "A hostname and domain name commonly form the device name used in RSA key generation. The other items are unrelated."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "TFTP, FTP, and SFTP",
    "points": [
      "TFTP is lightweight, uses UDP, and lacks built-in authentication and encryption.",
      "FTP uses separate control and data connections and is not encrypted by default.",
      "SFTP transfers files through SSH and protects the session with SSH security.",
      "Choose a transfer method based on device support, access control, and confidentiality."
    ],
    "questions": [
      [
        "Which file-transfer protocol commonly uses UDP and lacks built-in user authentication?",
        [
          "SFTP",
          "FTP",
          "TFTP",
          "HTTPS"
        ],
        [
          2
        ],
        "TFTP is lightweight and commonly uses UDP without built-in authentication or encryption. FTP and SFTP have different security properties."
      ],
      [
        "Which protocol transfers files through an encrypted SSH session?",
        [
          "TFTP",
          "FTP",
          "RCP",
          "SFTP"
        ],
        [
          3
        ],
        "SFTP runs through SSH and inherits its session protection. Classic FTP does not encrypt its credentials and data by default."
      ],
      [
        "Which statement describes classic FTP?",
        [
          "It uses control and data connections and may send credentials unencrypted.",
          "It is TFTP and uses UDP port 69.",
          "It carries every file over SSH.",
          "It is a DHCP option for server discovery."
        ],
        [
          0
        ],
        "Classic FTP uses control and data connections and is not encrypted by default. SFTP, not FTP, uses SSH."
      ],
      [
        "An administrator needs protected file transfer to a device that supports it. Which is a suitable choice?",
        [
          "TFTP",
          "Plain FTP",
          "DHCP relay",
          "SFTP"
        ],
        [
          3
        ],
        "SFTP uses SSH to protect file transfer. Plain TFTP and FTP do not provide equivalent confidentiality."
      ],
      [
        "Which two protocol facts are accurate?",
        [
          "TFTP is lightweight and commonly uses UDP.",
          "SFTP is a DNS zone transfer mode.",
          "FTP separates control and data connections.",
          "TFTP encrypts credentials by default.",
          "SFTP is unrelated to SSH."
        ],
        [
          0,
          2
        ],
        "TFTP is lightweight and UDP-based; classic FTP separates control and data. SFTP is SSH-based, and TFTP has no default encryption."
      ]
    ]
  },
  {
    "domain": "ip-services",
    "title": "IOS Copy and Configuration Transfer",
    "points": [
      "copy running-config startup-config saves active settings for the next reload.",
      "copy startup-config running-config merges saved commands into the active configuration.",
      "IOS copy uses source then destination, such as running-config, flash:, or tftp:.",
      "Confirm destination, reachability, and file name when transferring configuration or images."
    ],
    "questions": [
      [
        "Which command saves the current running configuration for use after a reload?",
        [
          "copy startup-config running-config",
          "copy flash: running-config",
          "write erase",
          "copy running-config startup-config"
        ],
        [
          3
        ],
        "Copying running-config to startup-config saves active settings for the next boot. write erase removes saved configuration."
      ],
      [
        "Which command applies the saved configuration to the running configuration?",
        [
          "copy running-config startup-config",
          "copy startup-config running-config",
          "copy tftp: startup-config",
          "erase startup-config"
        ],
        [
          1
        ],
        "copy startup-config running-config loads saved commands into the active configuration. The reverse direction saves active changes."
      ],
      [
        "Which command copies the running configuration to a TFTP server?",
        [
          "copy tftp: startup-config",
          "copy tftp: running-config",
          "copy startup-config flash:",
          "copy running-config tftp:"
        ],
        [
          3
        ],
        "The source is running-config and destination is tftp:. IOS can then prompt for server address and remote filename."
      ],
      [
        "Which command loads a configuration file from TFTP into the active configuration?",
        [
          "copy running-config tftp:",
          "copy startup-config tftp:",
          "copy ip helper-address running-config",
          "copy tftp: running-config"
        ],
        [
          3
        ],
        "copy tftp: running-config copies a remote file into the running configuration, generally merging its commands."
      ],
      [
        "What is an important effect of copying startup-config to running-config?",
        [
          "It removes all active commands omitted from the saved file.",
          "It erases flash automatically.",
          "It turns the router into a TFTP server.",
          "It merges saved commands into the current active configuration."
        ],
        [
          3
        ],
        "Loading startup-config into running-config applies or merges commands and is not necessarily a clean replacement. It does not erase flash."
      ],
      [
        "Which two copy operations are correctly described?",
        [
          "copy running-config startup-config saves active configuration.",
          "copy startup-config running-config transfers the config to TFTP.",
          "copy running-config tftp: sends the active configuration to a server.",
          "copy tftp: running-config erases the startup file.",
          "copy ip helper-address running-config saves DHCP relay."
        ],
        [
          0,
          2
        ],
        "The first command saves active settings locally and the third sends them to TFTP. Other commands are misdescribed or invalid."
      ]
    ]
  }
]
);
