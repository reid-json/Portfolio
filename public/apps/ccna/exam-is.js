examPool.push({
  "domain": "ip-services",
  "items": [
    [
      "A branch router translates a workstation address of 10.20.4.18 to 198.51.100.18 when it sends traffic to a public web server. Which address is the inside local address?",
      [
        "The router's outside interface address",
        "198.51.100.18",
        "The public web server address",
        "10.20.4.18"
      ],
      [
        3
      ],
      "The inside local address is the private address assigned to the inside host, 10.20.4.18. The translated public address is inside global; the web server is outside global, not an address of the inside host."
    ],
    [
      "A router should translate only 10.40.0.0/16 to its ISP interface address, using interface-address PAT. Which configuration pair is appropriate?",
      [
        "access-list 10 permit 10.40.0.0 0.0.255.255\nip nat inside source list 10 interface GigabitEthernet0/0 overload",
        "access-list 10 permit 10.40.0.0 255.255.0.0\nip nat outside source list 10 interface GigabitEthernet0/0 overload",
        "ip nat inside source static 10.40.0.0 0.0.255.255 interface GigabitEthernet0/0",
        "access-list 10 permit any\nip nat inside destination list 10 interface GigabitEthernet0/0"
      ],
      [
        0
      ],
      "A standard ACL identifies the inside local subnet, and inside-source list with overload performs PAT using the outside interface address. A wildcard mask is required; outside-source and destination forms do not implement this source PAT design."
    ],
    [
      "An administrator checks translations after a client opens an HTTP session. Interpret the relevant entry.\n\nPro Inside global      Inside local       Outside local      Outside global\ntcp 203.0.113.9:40001  10.1.2.25:51822   192.0.2.80:80     192.0.2.80:80\n\nWhich endpoint is represented by 203.0.113.9:40001?",
      [
        "The server as seen by the inside client",
        "The untranslated private client socket",
        "The server's public socket after destination NAT",
        "The translated inside client socket"
      ],
      [
        3
      ],
      "Inside global is the translated representation of the inside host, including the PAT port. 10.1.2.25:51822 is inside local; the two outside columns are identical because the server is not translated."
    ],
    [
      "Users on a new VLAN can reach internal servers but cannot reach the internet. The edge router has a valid default route and the expected inside/outside interface markings. `show ip nat statistics` reports zero active translations, and `show access-lists 25` shows no matches. What should be checked first?",
      [
        "Whether the upstream router has an IPv6 default route",
        "Whether the NAT ACL matches the VLAN's actual source subnet",
        "Whether the inside interface has `ip nat outside` configured",
        "Whether the DNS server supports dynamic updates"
      ],
      [
        1
      ],
      "No ACL matches means packets are not being selected for translation; compare the VLAN prefix against the NAT ACL and wildcard mask. An IPv6 route or DNS updates do not explain absent IPv4 NAT matches, and the stated interface markings rule out the tempting role reversal."
    ],
    [
      "Several inside clients share one public IPv4 address. Which behavior allows their simultaneous TCP sessions to remain distinguishable?",
      [
        "The router keeps one static mapping per remote server",
        "Each session receives a different inside global IPv4 address",
        "The router rewrites only the destination MAC address",
        "PAT assigns distinct transport-layer port mappings"
      ],
      [
        3
      ],
      "PAT distinguishes concurrent flows by translating transport ports along with the shared address. Separate public addresses describe a NAT pool, while MAC rewriting or per-server static mappings do not provide general session multiplexing."
    ],
    [
      "A router synchronizes from a server that is itself synchronized to a primary source. What does the router's NTP stratum communicate?",
      [
        "The maximum number of clients the server can serve",
        "The clock's UTC offset in seconds",
        "The count of NTP packets received during the last poll",
        "Its distance in synchronization hierarchy from a reference clock"
      ],
      [
        3
      ],
      "Stratum indicates the server's level relative to a reference clock; lower stratum numbers are closer in the hierarchy. It is not a client capacity, time offset, or packet counter."
    ],
    [
      "An IOS router at 10.0.0.1 must use 10.0.0.20 as its preferred NTP server. Which command is correct?",
      [
        "ntp master 10.0.0.20",
        "ntp peer 10.0.0.20 prefer",
        "ntp server 10.0.0.20 prefer",
        "clock set ntp 10.0.0.20"
      ],
      [
        2
      ],
      "`ntp server 10.0.0.20 prefer` configures the router as a client of that preferred server. `ntp master` makes the router an authoritative source, `ntp peer` requests peer association, and `clock set` does not configure NTP."
    ],
    [
      "A router has `ntp server 192.0.2.40` configured, but `show ntp status` remains unsynchronized. The server answers pings, and an ACL was recently added between the devices. Which traffic should be verified through the ACL?",
      [
        "TCP port 123 in both directions",
        "UDP port 53 from the router to the server",
        "UDP port 123 between the router and server",
        "TCP port 22 from the server to the router"
      ],
      [
        2
      ],
      "NTP uses UDP port 123, so the ACL must permit the NTP exchange. Ping only proves ICMP reachability; DNS and SSH are unrelated, and TCP 123 is not the normal NTP transport."
    ],
    [
      "A client broadcasts for an address, receives an offer, selects it, and then confirms its selection. Which sequence names those four DHCP messages in order?",
      [
        "Offer, Discover, Acknowledgment, Request",
        "Discover, Request, Offer, Acknowledgment",
        "Request, Offer, Discover, Acknowledgment",
        "Discover, Offer, Request, Acknowledgment"
      ],
      [
        3
      ],
      "DORA is Discover, Offer, Request, Acknowledgment. The client begins with Discover, so sequences starting with Request or Offer reverse the exchange."
    ],
    [
      "A DHCP server is located at 192.0.2.15, while clients are on a different subnet from the IOS router. On which interface should the relay destination be configured?",
      [
        "On the server-facing interface with `ip helper-address 192.0.2.15`",
        "On the client-facing interface with `ip helper-address 192.0.2.15`",
        "On the client-facing interface with `ip dhcp pool 192.0.2.15`",
        "On every router interface with `ip dhcp relay enable`"
      ],
      [
        1
      ],
      "Configure `ip helper-address 192.0.2.15` on the client-facing Layer 3 interface; it forwards client broadcasts as unicast to the server. The server-facing interface is not where the client's subnet is identified, and the other commands do not configure a relay destination."
    ],
    [
      "A switch using DHCP snooping receives legitimate DHCP offers from a server connected to an uplink. Clients on access ports receive no leases, and snooping drops the server replies as coming from an untrusted port. What is the correct change?",
      [
        "Trust the client access ports so they can accept offers",
        "Disable DHCP snooping on the server VLAN",
        "Configure the server-facing uplink as trusted",
        "Add the router's address to the snooping binding table manually"
      ],
      [
        2
      ],
      "Mark only the interface toward the legitimate DHCP server as trusted, for example with `ip dhcp snooping trust` in interface configuration. Client-facing access ports should normally remain untrusted; disabling snooping or fabricating bindings defeats its protections."
    ],
    [
      "An IOS router should serve 10.30.8.0/24, reserve 10.30.8.1 through 10.30.8.20, and advertise 10.30.8.1 as the default gateway. Which configuration is valid?",
      [
        "ip dhcp pool USERS\n network 10.30.8.0 0.0.0.255\n default-router 10.30.8.1",
        "ip dhcp pool USERS\n excluded-address 10.30.8.1 10.30.8.20\n network 10.30.8.0 255.255.255.0\n gateway 10.30.8.1",
        "ip dhcp excluded-address 10.30.8.0 255.255.255.0\nip dhcp pool USERS\n network 10.30.8.1 255.255.255.0\n default-router 10.30.8.1",
        "ip dhcp excluded-address 10.30.8.1 10.30.8.20\nip dhcp pool USERS\n network 10.30.8.0 255.255.255.0\n default-router 10.30.8.1"
      ],
      [
        3
      ],
      "IOS uses a global `ip dhcp excluded-address` range, then a pool with `network` and `default-router` statements. The alternatives put invalid commands in pool mode, confuse a wildcard with a subnet mask, or omit the required reservation."
    ],
    [
      "A client on a snooping-enabled access switch repeatedly sends DHCP Discover messages but gets no offer. The server is reachable, the server uplink is trusted, and the switch log shows client messages dropped after exceeding a configured rate limit. What is the best action?",
      [
        "Change the DNS server's UDP port to 67",
        "Trust every client-facing port",
        "Configure `ip helper-address` on the Layer 2 access port",
        "Increase the client-facing port's DHCP snooping rate limit to a suitable value"
      ],
      [
        3
      ],
      "The log identifies the snooping rate limit as the cause; adjust that interface's `ip dhcp snooping limit rate` to accommodate legitimate client behavior while retaining untrusted status. Trusting client ports weakens snooping, and helper address or DNS port settings do not resolve a Layer 2 snooping rate drop."
    ],
    [
      "A workstation resolves `portal.example.net` to an IPv4 address. Which DNS record type normally supplies the mapping from that host name to an IPv4 address?",
      [
        "PTR",
        "AAAA",
        "A",
        "MX"
      ],
      [
        2
      ],
      "An A record maps a hostname to an IPv4 address. AAAA is for IPv6, PTR supports reverse lookup, and MX identifies mail exchangers."
    ],
    [
      "A branch router is configured with a DNS server and `ip domain lookup`. It successfully resolves names after the first query, but packet capture shows no subsequent DNS requests for recently repeated names. What most likely explains this?",
      [
        "The router has changed the records into static NAT entries",
        "The router is converting DNS into DHCP relay traffic",
        "DNS resolution works only after an NTP leap-second update",
        "The router has cached prior DNS responses"
      ],
      [
        3
      ],
      "A caching resolver can answer repeated lookups from cached records until their TTL expires. DNS is independent of DHCP relay, NTP synchronization, and NAT configuration."
    ],
    [
      "A user can ping a web server by IPv4 address but cannot open it by hostname. The workstation's DHCP lease has the correct address and gateway. Which next check most directly isolates the likely service problem?",
      [
        "Inspect the DNS server address and test name resolution",
        "Enable NAT overload on the workstation",
        "Change the DHCP lease time to one minute",
        "Verify that the web server sends SNMP traps"
      ],
      [
        0
      ],
      "IP connectivity by address works, so verify the configured DNS resolver and its response for the hostname. NAT overload, lease duration, and SNMP notifications do not provide name resolution."
    ],
    [
      "An operations team requires SNMP monitoring with message authentication and encryption. Which SNMP choice best meets that requirement?",
      [
        "SNMPv1 with a community string and a management ACL",
        "SNMPv2c with a read-only community string",
        "SNMPv3 with authentication and privacy",
        "SNMPv2c traps sent through an SSH tunnel"
      ],
      [
        2
      ],
      "SNMPv3 with authentication and privacy provides authenticated, encrypted management messages. Community-based v1/v2c lack native encryption, and wrapping traps in an SSH tunnel is not an equivalent general SNMPv3 configuration."
    ],
    [
      "A monitoring station sends periodic requests to a router to read interface counters. Which SNMP operation pattern is being used?",
      [
        "The router sends traps in response to each poll",
        "The manager polls the agent using requests such as Get",
        "The agent initiates an Inform to read manager counters",
        "The manager sends a Set for every read-only object"
      ],
      [
        1
      ],
      "In polling, the manager requests management data from the agent, commonly with Get operations. Traps and informs are event notifications initiated by an agent, while Set changes writable objects."
    ],
    [
      "A syslog message is tagged with severity 2. Which description correctly identifies its severity?",
      [
        "Critical",
        "Error",
        "Alert",
        "Emergency"
      ],
      [
        0
      ],
      "Severity 2 is Critical. Severity 0 is Emergency, 1 is Alert, 3 is Error, and 4 is Warning, so the other listed levels do not match this message."
    ],
    [
      "An administrator wants a remote syslog server to receive informational messages and messages more severe than informational. Which IOS configuration is appropriate?",
      [
        "logging trap debugging",
        "logging host 192.0.2.50\nlogging trap informational",
        "logging source-interface informational",
        "logging trap warnings"
      ],
      [
        1
      ],
      "`logging host` identifies the remote collector and `logging trap informational` sets severity 6 as the threshold, including levels 0 through 6. Debugging is more inclusive than requested, warnings excludes informational, and source-interface selects an address rather than a severity."
    ],
    [
      "A network engineer needs to mark interactive voice packets so routers can provide expedited forwarding treatment. Which DSCP value is conventionally used for EF?",
      [
        "DSCP 46",
        "DSCP 0",
        "DSCP 8",
        "DSCP 26"
      ],
      [
        0
      ],
      "EF is DSCP 46, conventionally used for low-latency voice treatment. DSCP 0 is best effort; 8 and 26 are not the EF codepoint."
    ],
    [
      "A QoS policy uses Assured Forwarding classes and different drop precedence values within each class. What does the drop precedence distinguish?",
      [
        "The packet's Layer 2 VLAN membership",
        "The relative likelihood of dropping packets within the same AF class under congestion",
        "Whether the packet must be encrypted before forwarding",
        "The number of queues assigned to an AF class"
      ],
      [
        1
      ],
      "AF drop precedence ranks packets' relative discard likelihood within a class during congestion; higher drop precedence is more likely to be dropped. It does not define VLAN, encryption, or queue count."
    ],
    [
      "A campus switch must minimize delay for a small, well-controlled voice stream while still servicing other classes. Which queuing behavior best fits this goal?",
      [
        "Strict priority service for the voice queue with a configured rate limit",
        "FIFO service for every class without classification",
        "A shaping queue that delays voice until each interval ends",
        "A weighted queue that gives voice the smallest share"
      ],
      [
        0
      ],
      "A low-latency/priority queue gives voice expedited service; bounding it prevents it from starving other traffic. FIFO ignores class needs, shaping delays traffic, and a smallest-share weighted queue contradicts the latency goal."
    ],
    [
      "An edge policy must enforce a hard maximum rate on a subscriber. Excess packets should be discarded or remarked rather than buffered for later transmission. Which mechanism should be selected?",
      [
        "Traffic shaping",
        "Congestion avoidance",
        "Policing",
        "Priority queuing"
      ],
      [
        2
      ],
      "Policing enforces a rate by dropping or remarking excess traffic. Shaping typically buffers excess packets and sends them later; congestion avoidance manages queue buildup, and priority queuing is a scheduling choice."
    ],
    [
      "A router should preserve the DSCP markings of packets arriving from a trusted voice gateway, while applying a different policy to untrusted user endpoints. What design is most appropriate?",
      [
        "Trust markings at the gateway-facing boundary and classify or remark untrusted ingress",
        "Trust every access port and remove all DSCP values at the WAN",
        "Set every packet to EF at the core-facing interfaces",
        "Disable classification and rely on destination IP addresses only"
      ],
      [
        0
      ],
      "A trust boundary accepts markings from a controlled device and classifies or remarks traffic from untrusted sources. Trusting every endpoint invites abuse; marking all traffic EF defeats differentiated service, and destination-only classification ignores the intended policy."
    ],
    [
      "A WAN egress must smooth bursts by holding excess packets and transmitting them when capacity becomes available, without dropping them immediately. Which mechanism should be used?",
      [
        "Policing with a conform-action transmit",
        "Shaping with a queue",
        "Strict priority with no queue",
        "ACL-based packet filtering"
      ],
      [
        1
      ],
      "Shaping buffers excess packets and releases them over time to smooth bursts. Policing enforces a rate without normally buffering, priority scheduling does not itself smooth a rate, and ACL filtering only permits or denies traffic."
    ],
    [
      "A small IOS device must copy a configuration file from a server using a lightweight file-transfer service that provides no authentication or encryption. Which protocol and transport match that request?",
      [
        "FTP over TCP",
        "SFTP over TCP",
        "TFTP over UDP",
        "SSH over TCP"
      ],
      [
        2
      ],
      "TFTP is a simple, unauthenticated file-transfer protocol using UDP, typically server port 69 for the initial request. FTP uses TCP and has separate control/data connections; SFTP uses SSH and is encrypted."
    ],
    [
      "A firewall policy must permit traditional FTP control setup and its separate data transfer in active mode. Which ports and transport are associated with that control setup?",
      [
        "TCP 20 for control and TCP 21 for data",
        "UDP 21 for control and UDP 20 for data",
        "TCP 21 for control; data uses a separate TCP connection",
        "TCP 69 for control and UDP 69 for data"
      ],
      [
        2
      ],
      "FTP control uses TCP port 21, and file data uses a separate TCP connection; active-mode data commonly originates from server TCP port 20. Option A reverses the usual port roles, while UDP and TFTP port 69 are not traditional FTP control."
    ],
    [
      "An IOS router must accept encrypted remote CLI sessions using local user credentials. Which set of steps establishes the required SSH prerequisites and VTY restriction?",
      [
        "ip domain-name example.net\ncrypto key generate rsa\nusername netops secret <secret>\nline vty 0 4\n login local\n transport input ssh",
        "ip name-server 192.0.2.53\ncrypto key generate dsa\nline vty 0 4\n password <secret>\n transport input telnet",
        "username netops password <secret>\nline vty 0 4\n login\n transport input all",
        "ip domain-name example.net\nline vty 0 4\n login local\n transport input telnet"
      ],
      [
        0
      ],
      "SSH requires a domain name and RSA keys on typical IOS configurations; local username credentials are applied using `login local`, and `transport input ssh` excludes Telnet. A DNS server does not substitute for a domain name, `transport input all` permits insecure protocols, and Telnet is not encrypted."
    ],
    [
      "An administrator can SSH to a router, but authentication fails even though the local username and secret are correct. The VTY lines show `login` and a line password, with no `login local`. What change best enables the intended local-user authentication?",
      [
        "Remove the RSA keys and enable Telnet",
        "Configure `login local` under the VTY lines",
        "Set `transport output ssh` under the VTY lines",
        "Configure `ip helper-address` on the management interface"
      ],
      [
        1
      ],
      "`login local` tells VTY lines to authenticate against the local username database. `login` uses the line password; transport output concerns outbound sessions, and DHCP relay is unrelated."
    ],
    [
      "A router performs inside-source NAT for a LAN and has a single ISP-facing interface. Which interface roles are required for the usual configuration?",
      [
        "`ip nat outside` on the LAN and `ip nat inside` on the ISP link",
        "`ip nat inside` on the LAN and `ip nat outside` on the ISP link",
        "`ip nat inside` on both interfaces",
        "No interface roles are needed when an ACL is present"
      ],
      [
        1
      ],
      "Mark the LAN as inside and the ISP link as outside for inside-source NAT. Reversing the roles or marking both interfaces identically prevents the intended translation direction; an ACL alone does not define interface roles."
    ],
    [
      "Clients in a remote VLAN use a central DHCP server, and the router interface for that VLAN is configured with a helper address. Which statement correctly describes the relay's role in the initial exchange?",
      [
        "It converts a client broadcast into a unicast request toward the configured server",
        "It changes the client's requested DNS name into a DNS update",
        "It assigns an address locally without consulting the DHCP server",
        "It forwards the broadcast unchanged across every routed interface"
      ],
      [
        0
      ],
      "A DHCP relay forwards client broadcasts as unicast toward the configured server and supplies relay information identifying the client subnet. It does not perform DNS resolution, independently lease an address, or propagate Layer 2 broadcasts through routed networks."
    ],
    [
      "Which TWO changes help ensure that only the intended inside subnet is translated using PAT through the ISP interface?",
      [
        "Use a standard ACL that permits only the inside local subnet",
        "Configure `ip nat outside source list` for the inside client pool",
        "Apply `ip nat inside` on the LAN and `ip nat outside` on the ISP interface",
        "Remove `overload` so all clients share one translation port",
        "Set the NAT ACL wildcard mask equal to the subnet mask"
      ],
      [
        0,
        2
      ],
      "A narrowly scoped ACL selects the inside hosts, and correct interface roles identify the translation direction. Outside-source NAT is the wrong operation, overload is needed for sharing one address, and ACL wildcard bits are the inverse of the subnet mask."
    ],
    [
      "A monitoring platform requires SNMP messages to be authenticated and encrypted, and the IOS device should send event notifications without waiting for a poll. Which TWO choices are appropriate?",
      [
        "Configure SNMPv3 with authentication and privacy",
        "Use an SNMPv2c community string as encryption",
        "Send SNMP traps for the events",
        "Use SNMP Get requests initiated by the device",
        "Disable authentication and rely on UDP checksums"
      ],
      [
        0,
        2
      ],
      "SNMPv3 authentication and privacy provide message integrity/authentication and encryption, while traps are agent-initiated notifications. Community strings do not encrypt v2c, Get is a manager-initiated poll, and UDP checksums do not replace security."
    ],
    [
      "A provider is comparing traffic policing and shaping for a customer handoff. Which TWO statements are accurate?",
      [
        "Shaping can buffer excess traffic and transmit it later",
        "Policing necessarily delays all excess packets in a queue",
        "Policing can drop or remark traffic exceeding its rate",
        "Shaping always discards a burst as soon as the rate is exceeded",
        "Policing and shaping are identical names for queue scheduling"
      ],
      [
        0,
        2
      ],
      "Shaping commonly queues excess traffic for later transmission, while policing can discard or remark nonconforming packets. The reverse descriptions incorrectly assign shaping's buffering to policing and policing's immediate enforcement to shaping; neither term means queue scheduling itself."
    ],
    [
      "A DHCP snooping switch receives valid server replies through a distribution uplink but drops them because that port is untrusted. Which TWO actions are appropriate while preserving snooping protections?",
      [
        "Configure `ip dhcp snooping trust` on the legitimate server-facing uplink",
        "Configure `ip dhcp snooping trust` on every user access port",
        "Keep client-facing ports untrusted",
        "Disable DHCP snooping globally",
        "Add `ip nat inside` to the server-facing switch port"
      ],
      [
        0,
        2
      ],
      "Trust the path to the legitimate DHCP server and retain untrusted status on client-facing ports. Trusting all access ports or disabling snooping permits rogue DHCP replies; NAT interface roles do not affect switch snooping."
    ],
    {
      "type": "dnd",
      "question": "Match each NAT address term to the address representation it identifies in a translation.",
      "pairs": [
        [
          "Inside local",
          "Inside host address as used on the private network"
        ],
        [
          "Inside global",
          "Publicly routable representation of the inside host"
        ],
        [
          "Outside local",
          "Outside host address as it appears to the inside network"
        ],
        [
          "Outside global",
          "Outside host address as used on the external network"
        ]
      ],
      "explanation": "Inside terms identify the translated subject host; local is its local-side representation and global is its globally reachable representation. Outside terms describe the remote host from the inside and outside perspectives, respectively."
    },
    {
      "type": "dnd",
      "question": "Match each syslog severity number to its standard severity name.",
      "pairs": [
        [
          "0",
          "Emergency"
        ],
        [
          "1",
          "Alert"
        ],
        [
          "2",
          "Critical"
        ],
        [
          "3",
          "Error"
        ],
        [
          "4",
          "Warning"
        ]
      ],
      "explanation": "Syslog severity runs from 0, Emergency, as most severe through 7, Debug, as least severe. These adjacent values are not interchangeable; for example, level 2 is Critical rather than Alert or Error."
    },
    {
      "type": "dnd",
      "question": "Match each QoS behavior or term to its operational description.",
      "pairs": [
        [
          "Marking",
          "Writes a traffic-class value such as DSCP into packet metadata"
        ],
        [
          "PHB",
          "Defines the per-hop forwarding treatment associated with a class"
        ],
        [
          "Policing",
          "Enforces a rate by dropping or remarking nonconforming traffic"
        ],
        [
          "Shaping",
          "Buffers excess traffic and releases it over time"
        ],
        [
          "Queuing",
          "Schedules classified packets for transmission during contention"
        ]
      ],
      "explanation": "Marking labels traffic; a per-hop behavior describes how a node treats a class. Policing enforces a rate without smoothing via a queue, shaping buffers to smooth bursts, and queuing determines transmission order or share."
    },
    {
      "type": "dnd",
      "question": "Match each DHCP term to the correct stage or function in a routed client lease exchange.",
      "pairs": [
        [
          "Discover",
          "Client broadcast seeking a DHCP server"
        ],
        [
          "Offer",
          "Server proposal containing configuration and an address"
        ],
        [
          "Request",
          "Client indicates which offered lease it wants"
        ],
        [
          "Acknowledgment",
          "Server confirms the lease and its parameters"
        ],
        [
          "Relay agent",
          "Forwards client broadcasts as unicast toward a server"
        ]
      ],
      "explanation": "DORA proceeds Discover, Offer, Request, then Acknowledgment. A relay agent is not a fifth DORA message; it transports the client's broadcast across a routed boundary to the server."
    }
  ]
});
