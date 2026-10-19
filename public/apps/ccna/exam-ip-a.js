examPool.push({
  "domain": "ip-connectivity",
  "items": [
    [
      "A router receives a packet for 10.20.30.77. Its table contains: \nO 10.20.30.0/24 [110/20] via 192.0.2.1\nS 10.20.30.64/26 [1/0] via 192.0.2.5\nC 10.20.0.0/16 is directly connected, GigabitEthernet0/0. Which route is used?",
      [
        "The static /26 because it is the most-specific matching prefix",
        "The OSPF /24 because its administrative distance is lower than the static route's",
        "The connected /16 because connected routes always take precedence",
        "The OSPF /24 because it has a nonzero metric"
      ],
      [
        0
      ],
      "Explanation: Forwarding first uses the longest matching prefix, so /26 wins. Administrative distance compares candidate routes to the same prefix, not routes of different prefix lengths."
    ],
    [
      "A routing table has two routes to 172.16.8.0/24: OSPF [110/30] and EIGRP internal [90/400]. Both are eligible, and neither is otherwise preferred by policy. Which route is installed?",
      [
        "The OSPF route because its metric is numerically smaller",
        "The EIGRP route because its administrative distance is lower",
        "Both routes, because their metrics use different scales",
        "The route learned first, because administrative distance is only for static routes"
      ],
      [
        1
      ],
      "Explanation: For the same prefix, the lower administrative distance wins, so internal EIGRP at 90 beats OSPF at 110. Metrics from different protocols are not compared."
    ],
    [
      "A router learns 198.51.100.0/24 through OSPF with metric 25 and through another OSPF path with metric 40. What should the router normally install?",
      [
        "Both paths, regardless of whether equal-cost",
        "The metric-40 path, because larger metrics indicate more available bandwidth",
        "The metric-25 path, because both routes use the same protocol and prefix",
        "Neither path until their administrative distances are changed"
      ],
      [
        2
      ],
      "Explanation: For routes to the same prefix learned through the same protocol, the protocol's metric selects the better path; lower OSPF cost is preferred. The unrelated option about changing AD is not required."
    ],
    [
      "Which command configures an IPv4 static default route using next-hop address 203.0.113.1?",
      [
        "ip route 0.0.0.0 255.255.255.255 203.0.113.1",
        "ip default-gateway 203.0.113.1 0.0.0.0",
        "ip route 255.255.255.255 0.0.0.0 203.0.113.1",
        "ip route 0.0.0.0 0.0.0.0 203.0.113.1"
      ],
      [
        3
      ],
      "Explanation: An IPv4 default route uses destination 0.0.0.0 and mask 0.0.0.0. The /32 option is a host route, not a default."
    ],
    [
      "A router has a primary static route to 192.0.2.0/24 through 10.0.0.1. Configure a backup through 10.0.0.2 that is used only if the primary disappears. Which command is appropriate?",
      [
        "ip route 192.0.2.0 255.255.255.0 10.0.0.2 5",
        "ip route 192.0.2.0 255.255.255.0 10.0.0.2 1",
        "ip route 192.0.2.0 255.255.255.255 10.0.0.2 200",
        "ip route 10.0.0.2 255.255.255.255 192.0.2.0 200"
      ],
      [
        0
      ],
      "Explanation: The primary static route has the default static AD of 1, so a backup static route with a higher AD such as 5 is floating. A /32 destination would not match the /24 network."
    ],
    [
      "A router must reach only host 192.0.2.77 through next hop 10.1.1.1. Which command installs a host route?",
      [
        "ip route 192.0.2.0 255.255.255.0 10.1.1.1",
        "ip route 192.0.2.77 255.255.255.255 10.1.1.1",
        "ip route 0.0.0.0 255.255.255.255 10.1.1.1",
        "ip route 192.0.2.77 255.255.255.0 10.1.1.1"
      ],
      [
        1
      ],
      "Explanation: A host route is IPv4 /32, mask 255.255.255.255, for exactly one address. The /24 choices cover a subnet instead."
    ],
    [
      "Which Cisco IOS command creates an IPv6 default static route through next-hop 2001:db8:12::1?",
      [
        "ipv6 route ::1/128 2001:db8:12::1",
        "ipv6 route 0:0:0:0:0:0:0:1/0 2001:db8:12::1",
        "ipv6 route ::/0 2001:db8:12::1",
        "ip route ::/0 2001:db8:12::1"
      ],
      [
        2
      ],
      "Explanation: The IPv6 default prefix is ::/0 and the IPv6 static-route command is ipv6 route. ::1/128 is a host prefix."
    ],
    [
      "A destination address is 10.4.7.9. The table shows S 10.4.0.0/16 via 192.0.2.1 and S 10.4.7.0/24 via 192.0.2.2. Which next hop is selected?",
      [
        "192.0.2.1 because the /16 static route has lower AD",
        "The router discards the packet because two prefixes match",
        "Both next hops, because both routes are static",
        "192.0.2.2 because /24 is the longest matching prefix"
      ],
      [
        3
      ],
      "Explanation: Both routes match, but forwarding selects the most-specific matching prefix, /24. AD does not override longest-prefix match."
    ],
    [
      "A route table lists R 10.1.0.0/16 [120/2] via 192.0.2.9 and S 10.1.2.0/24 [1/0] via 192.0.2.10. For a packet to 10.1.2.8, which next hop is used?",
      [
        "192.0.2.10 because /24 is more specific",
        "192.0.2.9 because RIP has the lower metric",
        "192.0.2.10 only if the static route's AD is increased",
        "192.0.2.9 because static routes are not used for forwarding"
      ],
      [
        0
      ],
      "Explanation: The static /24 is more specific than the RIP /16 and therefore wins. Comparing their ADs is unnecessary because their prefixes differ."
    ],
    [
      "A router forwards a packet out Ethernet toward a remote destination. The next-hop MAC address is already in its ARP cache. What happens to the Ethernet header?",
      [
        "The router preserves the source and destination MAC addresses from the incoming frame",
        "The router replaces the source MAC with its outgoing-interface MAC and destination MAC with the next-hop MAC",
        "The router sets the destination MAC to the final remote host's MAC in every case",
        "The router replaces only the IP destination and leaves the Ethernet header unchanged"
      ],
      [
        1
      ],
      "Explanation: At each routed Ethernet hop, the router builds a new Layer 2 header for the outgoing link, using its egress MAC as source and the adjacent next hop's MAC as destination. The incoming frame's MACs are not carried end to end."
    ],
    [
      "A router receives an IPv4 packet on Ethernet and forwards it to another routed network. Which IPv4 header field is normally reduced by one at this hop?",
      [
        "Protocol",
        "Fragment offset",
        "TTL",
        "Header checksum value by a fixed one"
      ],
      [
        2
      ],
      "Explanation: The router decrements IPv4 TTL by one and updates the IPv4 header checksum accordingly. The protocol and fragment offset are not decremented."
    ],
    [
      "An IOS router receives a frame addressed to its own interface MAC. The destination IPv4 address is remote, and the next-hop MAC is not cached. What does the router do before sending the packet?",
      [
        "Use ICMP to ask the destination host for its MAC address",
        "Broadcast an ARP request for the remote destination on the incoming Ethernet",
        "Send the original Ethernet frame unchanged to every interface",
        "Broadcast an ARP request on the outgoing Ethernet for the next-hop IPv4 address"
      ],
      [
        3
      ],
      "Explanation: The router resolves the Layer 2 address of the selected on-link next hop on the egress Ethernet. It does not ARP for a remote destination through the local segment."
    ],
    [
      "Which statement correctly describes the main route-selection order on a router when forwarding a packet?",
      [
        "Choose the longest matching prefix; route installation for an identical prefix uses administrative distance and then protocol metric",
        "Choose the route with the lowest administrative distance, even if another route has a longer prefix",
        "Compare metrics across all protocols, then choose the lowest administrative distance",
        "Choose the route with the largest prefix metric, then resolve its next hop"
      ],
      [
        0
      ],
      "Explanation: Forwarding uses longest-prefix match. During route selection for competing sources for the same prefix, administrative distance selects the source and the protocol metric selects among routes within that protocol."
    ],
    [
      "A router's table shows: \nC 10.10.4.0/24 is directly connected, GigabitEthernet0/1\nS 0.0.0.0/0 [1/0] via 192.0.2.1\nA packet arrives for 10.10.4.200. Which action is expected?",
      [
        "Send it to 192.0.2.1 because a static route has lower AD",
        "Forward it out GigabitEthernet0/1 because the connected /24 is more specific",
        "Drop it because connected routes cannot forward packets",
        "Flood it on all interfaces because the host address is not listed"
      ],
      [
        1
      ],
      "Explanation: The connected /24 is more specific than the default /0, so it is selected and the router delivers the packet on GigabitEthernet0/1. A connected route is a valid forwarding route."
    ],
    [
      "A router has two OSPF routes for 203.0.113.0/24: one with cost 18 and one with cost 18. Assume equal-cost load balancing is enabled and no other constraint applies. What is the expected result?",
      [
        "Install only the first path because OSPF never uses equal-cost routes",
        "Install neither until one cost becomes 19",
        "Install both paths as equal-cost routes",
        "Select the path with the greater next-hop IP address"
      ],
      [
        2
      ],
      "Explanation: Equal-cost paths learned through the same protocol can both be installed for load sharing, subject to platform limits and configuration. OSPF does support equal-cost multipath."
    ],
    [
      "Which two statements about administrative distance and routing metrics are correct?",
      [
        "Administrative distance compares the trustworthiness of route sources for the same prefix",
        "A lower metric from OSPF always beats any static route to the same prefix",
        "A route's metric is generally interpreted by its own routing protocol",
        "A higher administrative distance is preferred when installing competing routes",
        "Metrics from RIP and OSPF are directly compared as a common unit"
      ],
      [
        0,
        2
      ],
      "Explanation: AD chooses between route sources for the same prefix, while metrics are protocol-specific and rank paths within a protocol. A lower AD is preferred; unrelated protocols' metric units are not directly comparable."
    ],
    [
      "An administrator wants a static route to 198.51.100.0/24 through Ethernet next hop 192.0.2.1, but only as backup to an existing OSPF route for that exact prefix. Which configuration is appropriate?",
      [
        "ip route 0.0.0.0 0.0.0.0 192.0.2.1 200",
        "ip route 198.51.100.0 255.255.255.0 192.0.2.1 1",
        "ip route 198.51.100.0 255.255.255.255 192.0.2.1 200",
        "ip route 198.51.100.0 255.255.255.0 192.0.2.1 200"
      ],
      [
        3
      ],
      "Explanation: OSPF's default AD is 110, so a static route to the same /24 with AD 200 floats behind it. AD 1 would displace OSPF; the /32 and /0 options specify different destinations."
    ],
    [
      "A router's table shows O 192.168.32.0/20 via 10.0.0.2. A packet is destined for 192.168.47.254. Which statement is correct?",
      [
        "It matches the /20 because that prefix spans 192.168.32.0 through 192.168.47.255",
        "It does not match because /20 ends at 192.168.32.255",
        "It matches only if the route is changed to /16",
        "It matches only when the destination host responds to ARP"
      ],
      [
        0
      ],
      "Explanation: A /20 mask is 255.255.240.0, so the third octet range for 192.168.32.0/20 is 32 through 47. The destination is inside that range."
    ],
    [
      "Which command configures an IPv6 host route for 2001:db8:5::9 through next hop 2001:db8:1::1?",
      [
        "ipv6 route 2001:db8:5::9/64 2001:db8:1::1",
        "ipv6 route 2001:db8:5::9/128 2001:db8:1::1",
        "ipv6 route ::/128 2001:db8:1::1",
        "ip route 2001:db8:5::9 128 2001:db8:1::1"
      ],
      [
        1
      ],
      "Explanation: IPv6 host routes use a /128 prefix length. The /64 is a subnet route, and IPv6 routes use the ipv6 route command."
    ],
    [
      "An IPv4 router has a route 203.0.113.128/25 via 192.0.2.1 and a default route via 192.0.2.254. A packet is destined for 203.0.113.200. Which next hop is selected?",
      [
        "192.0.2.254, because a default route is preferred over a specific route",
        "Both next hops are used because the routes overlap",
        "192.0.2.1, because /25 is more specific than /0",
        "No route, because 203.0.113.200 is a host address"
      ],
      [
        2
      ],
      "Explanation: The destination lies in 203.0.113.128/25, which is a longer match than the default route. Host addresses are routinely forwarded using network prefixes."
    ],
    [
      "A branch router's only route for remote IPv4 destinations should point to the ISP at 198.51.100.1. Which command is the correct default route?",
      [
        "ip default-network 198.51.100.1 0.0.0.0",
        "ip route 198.51.100.1 255.255.255.255 0.0.0.0",
        "ip route 255.255.255.255 0.0.0.0 198.51.100.1",
        "ip route 0.0.0.0 0.0.0.0 198.51.100.1"
      ],
      [
        3
      ],
      "Explanation: The 0.0.0.0/0 route is the IPv4 default route, with the ISP address as its next hop. A /32 route to the ISP itself does not route arbitrary destinations."
    ],
    [
      "Which two are standard routing protocol classification categories?",
      [
        "Distance vector",
        "Ethernet switching",
        "Link state",
        "Address resolution",
        "Network address translation"
      ],
      [
        0,
        2
      ],
      "Explanation: Distance vector and link state describe routing protocol algorithm categories. Switching, ARP, and NAT are different networking functions."
    ],
    [
      "A technician runs ping from a router to a remote server. Replies arrive, but traceroute shows some intermediate hops as timeouts before the destination responds. What is the best interpretation?",
      [
        "Some intermediate devices may filter or rate-limit probe responses while forwarding traffic",
        "The destination response proves that every intermediate router must answer traceroute",
        "The path necessarily contains a routing loop",
        "The remote server's MAC address is missing from the first router's ARP cache"
      ],
      [
        0
      ],
      "Explanation: Routers may forward probes yet suppress or rate-limit the ICMP responses used by traceroute, so missing intermediate hops alone do not prove a forwarding failure. A successful destination response confirms end-to-end reachability for those probes."
    ],
    [
      "A user reports that ping to a server's IP address works but ping to its hostname fails. Which troubleshooting focus is most appropriate first?",
      [
        "The router's Ethernet MTU",
        "DNS name resolution",
        "OSPF hello/dead timers",
        "The server's ARP cache"
      ],
      [
        1
      ],
      "Explanation: Reachability by IP but not hostname points first to name resolution, such as DNS configuration or records. The successful IP ping makes basic routed reachability less likely to be the cause."
    ],
    [
      "A router can ping its directly connected neighbor, but ping to a remote subnet fails. The local interface is up/up. Which two checks are most relevant next?",
      [
        "Verify a route to the remote destination and a return route from the remote side",
        "Replace the router's Ethernet cable before examining any routing information",
        "Check whether an ACL or firewall blocks the probes or replies",
        "Clear the local ARP cache even though the directly connected neighbor responds",
        "Change the router's hostname to match the remote server"
      ],
      [
        0,
        2
      ],
      "Explanation: Remote ping failure despite local neighbor reachability warrants checking forward and return routing, and filtering of ICMP probes or replies. ARP to the working neighbor and the hostname are not the primary next checks."
    ],
    [
      "A router's GigabitEthernet0/0 displays administratively down, line protocol down. What is the most direct corrective action if this interface should be enabled?",
      [
        "Add a static default route",
        "Change the interface's IP address to a /32",
        "Configure no shutdown under the interface",
        "Clear the routing table"
      ],
      [
        2
      ],
      "Explanation: Administratively down means the interface is disabled by configuration; no shutdown enables it. Routing changes do not bring an administratively disabled interface up."
    ],
    [
      "A router interface displays up/down. What does this status most commonly indicate?",
      [
        "The interface is administratively disabled",
        "The interface has no IPv4 address, so it is shut down",
        "Both physical and data-link layers are operational",
        "The physical layer is up, but the line protocol is not operational"
      ],
      [
        3
      ],
      "Explanation: Up/down means the physical interface is up while the line protocol is down, often due to a data-link or keepalive issue. Administratively disabled interfaces show administratively down."
    ],
    [
      "A router interface displays down/down and is not administratively shut. Which first investigation is most appropriate?",
      [
        "Inspect physical connectivity, cable, peer state, and transceiver",
        "Increase the OSPF metric on the interface",
        "Replace the default route with a host route",
        "Clear the ARP table on remote hosts"
      ],
      [
        0
      ],
      "Explanation: Down/down generally indicates loss of physical link or lower-layer signaling, so inspect cabling, peer state, and optics first. Routing metrics cannot repair a physical link failure."
    ],
    [
      "A route summary must cover 192.168.16.0/24 through 192.168.19.0/24 with the fewest single prefix. Which summary is correct?",
      [
        "192.168.16.0/21",
        "192.168.16.0/22",
        "192.168.16.0/23",
        "192.168.0.0/20"
      ],
      [
        1
      ],
      "Explanation: The four contiguous /24 networks 16 through 19 align on a /22 boundary and share their first 22 bits, so 192.168.16.0/22 is the exact summary. A /21 includes extra networks."
    ],
    [
      "What is the smallest single summary that includes 10.8.0.0/24 through 10.8.3.0/24?",
      [
        "10.8.0.0/23",
        "10.8.0.0/21",
        "10.8.0.0/22",
        "10.8.0.0/24"
      ],
      [
        2
      ],
      "Explanation: Four aligned /24 blocks combine into a /22, covering third-octet values 0 through 3. A /23 covers only 0 and 1; /21 is broader than needed."
    ],
    [
      "Which pair of commands correctly configures an IPv4 static route to 10.50.0.0/16 using next hop 192.0.2.2 and an IPv6 static route to 2001:db8:50::/48 using next hop 2001:db8:1::2?",
      [
        "ip route 10.50.0.0 255.255.255.0 192.0.2.2; ipv6 route 2001:db8:50::/64 2001:db8:1::2",
        "ip route 10.50.0.0 255.0.0.0 192.0.2.2; ip route 2001:db8:50::/48 2001:db8:1::2",
        "ipv6 route 10.50.0.0/16 192.0.2.2; ip route 2001:db8:50::/48 2001:db8:1::2",
        "ip route 10.50.0.0 255.255.0.0 192.0.2.2; ipv6 route 2001:db8:50::/48 2001:db8:1::2"
      ],
      [
        3
      ],
      "Explanation: IPv4 static routes take a network address, dotted-decimal mask, and next hop; /16 is 255.255.0.0. IPv6 routes use ipv6 route with prefix length notation."
    ],
    [
      "The routing table displays O E2 203.0.113.0/24 [110/20] via 192.0.2.5. What does O E2 identify?",
      [
        "An OSPF external type 2 route",
        "An OSPF intra-area route with metric 2",
        "An EIGRP external route with AD 20",
        "A static route with an OSPF next hop"
      ],
      [
        0
      ],
      "Explanation: O E2 denotes an OSPF external type 2 route. The bracketed values are administrative distance and metric, so 110/20 does not mean AD 20."
    ],
    [
      "A router has two routes for 10.30.0.0/16: RIP [120/2] and OSPF [110/50]. Which is normally installed?",
      [
        "RIP, because its metric 2 is less than 50",
        "OSPF, because its administrative distance 110 is lower than RIP's 120",
        "RIP, because RIP has a lower default metric scale",
        "Both, since their metrics are incomparable"
      ],
      [
        1
      ],
      "Explanation: For the same prefix, OSPF's default AD 110 is lower than RIP's 120, so OSPF is selected. Comparing the protocol-specific metric values across protocols is invalid."
    ],
    [
      "A router is to use 172.31.0.0/16 through 10.0.0.1 only if its OSPF-learned route to that same prefix vanishes. What must be true of the static route's AD?",
      [
        "It must be less than OSPF's 110",
        "It must equal 110",
        "It must be greater than OSPF's 110",
        "Its metric must equal the OSPF cost"
      ],
      [
        2
      ],
      "Explanation: To float behind OSPF for an identical prefix, the static route needs a higher AD than OSPF's default 110, such as 200. Matching metrics across the sources is irrelevant."
    ],
    [
      "A router sends traffic for a remote subnet across two Ethernet routers. Which Layer 2 destination does the first router place in its outbound frame?",
      [
        "The remote destination host's MAC address",
        "The broadcast MAC address for every routed packet",
        "The source host's original MAC address",
        "The second router's MAC address on the directly connected link"
      ],
      [
        3
      ],
      "Explanation: The first router addresses its outbound Ethernet frame to the MAC of the adjacent next hop on that link. The remote host's MAC is not carried across routed hops."
    ],
    [
      "A router forwards an IPv4 datagram whose TTL is 1. What is the normal result when forwarding would require another routed hop?",
      [
        "Discard it and typically send ICMP Time Exceeded to the source",
        "Forward it with TTL 0 and recalculate the checksum",
        "ARP for the source host and reset TTL to 64",
        "Forward it unchanged if the next-hop MAC is cached"
      ],
      [
        0
      ],
      "Explanation: A router decrements TTL; if it expires, the packet is discarded and an ICMP Time Exceeded message is typically generated, subject to filtering and rate limiting. ARP does not reset TTL."
    ],
    [
      "A traceroute probe reaches a router whose outgoing path has no matching route to the destination. Which symptom could result?",
      [
        "The router always substitutes its own MAC as the final destination",
        "The router may send an ICMP destination unreachable response",
        "The probe's TTL is increased to prevent a loop",
        "The router must reply with an ARP response from the destination host"
      ],
      [
        1
      ],
      "Explanation: A router without a matching route may drop the packet and can return an ICMP destination-unreachable message. It does not increase TTL or resolve a remote host's MAC itself."
    ],
    [
      "Two networks 10.16.0.0/24 and 10.16.1.0/24 are the only intended components of a summary. What is their smallest exact aggregate?",
      [
        "10.16.0.0/22",
        "10.16.0.0/24",
        "10.16.0.0/23",
        "10.16.1.0/23"
      ],
      [
        2
      ],
      "Explanation: Two adjacent /24 blocks aligned at an even third octet aggregate to 10.16.0.0/23. A /22 includes two additional /24 networks."
    ],
    [
      "A network team needs a summary for 192.168.64.0/24 through 192.168.71.0/24. Which prefix is the smallest aligned aggregate?",
      [
        "192.168.64.0/24",
        "192.168.64.0/22",
        "192.168.64.0/20",
        "192.168.64.0/21"
      ],
      [
        3
      ],
      "Explanation: Eight adjacent /24 networks aggregate to /21, and 64 is aligned on an eight-network boundary. /22 covers only four /24s, while /20 is unnecessarily broad."
    ],
    [
      "Which two statements accurately describe IPv4 and IPv6 static route configuration on IOS?",
      [
        "IPv4 ip route commands specify a destination mask, often dotted decimal",
        "IPv6 ipv6 route commands express the prefix length with slash notation",
        "IPv6 routes use ip route and a dotted-decimal mask",
        "IPv4 default routes use ::/0",
        "IPv6 host routes use /32"
      ],
      [
        0,
        1
      ],
      "Explanation: IPv4 ip route syntax uses a dotted-decimal mask, while IPv6 ipv6 route syntax uses prefix notation. IPv6 default is ::/0 and IPv6 host route is /128."
    ],
    [
      "A router's show ip route output is: \nS 0.0.0.0/0 [1/0] via 203.0.113.9\nC 203.0.113.8/30 is directly connected, GigabitEthernet0/0\nA packet to 8.8.8.8 arrives. What is the router's forwarding decision?",
      [
        "Use next hop 203.0.113.9 via the default route",
        "Use the connected /30 because it has a lower metric",
        "Drop the packet because no exact 8.8.8.8 route exists",
        "ARP for 8.8.8.8 on GigabitEthernet0/0"
      ],
      [
        0
      ],
      "Explanation: The destination does not match the connected 203.0.113.8/30, so the default route /0 is the best match. The router resolves the default route's next hop, not the remote 8.8.8.8 address."
    ],
    [
      "A router's show ip route contains: \nO 10.60.0.0/16 [110/25] via 192.0.2.1\nO 10.60.8.0/21 [110/70] via 192.0.2.2\nA packet is destined for 10.60.15.5. Which path is used?",
      [
        "Via 192.0.2.1 because its OSPF metric is lower",
        "Via 192.0.2.2 because /21 is more specific and includes 10.60.15.5",
        "Via both paths because OSPF metrics are considered after matching",
        "No route because the /21 is not aligned"
      ],
      [
        1
      ],
      "Explanation: 10.60.8.0/21 covers third-octet values 8-15 and is a more-specific match than /16. Metric 70 cannot make the less-specific route win."
    ],
    [
      "A remote site's IPv6 network 2001:db8:abcd::/48 is reachable through next hop fe80::2 on GigabitEthernet0/1. Which IOS command properly identifies the interface for this link-local next hop?",
      [
        "ip route 2001:db8:abcd::/48 fe80::2 GigabitEthernet0/1",
        "ipv6 route 2001:db8:abcd::/48 2001:db8::2",
        "ipv6 route 2001:db8:abcd::/48 fe80::2 GigabitEthernet0/1",
        "ipv6 route fe80::2/128 2001:db8:abcd::/48"
      ],
      [
        2
      ],
      "Explanation: A link-local IPv6 next hop is scoped to a link, so the outgoing interface must be specified with the next-hop address in the static route. The other commands reverse the route or use IPv4 syntax."
    ],
    [
      "A router's interface is up/up, but it cannot ping its directly connected neighbor. The interface has the expected IP configuration. Which two checks are most useful at this point?",
      [
        "Verify the neighbor's interface/IP and subnet mask",
        "Check ARP resolution and Layer 2 connectivity on the segment",
        "Raise the administrative distance of every static route",
        "Change the router's hostname",
        "Summarize the neighbor network to a /0"
      ],
      [
        0,
        1
      ],
      "Explanation: For a directly connected neighbor, verify both ends' addressing and subnet masks and test Layer 2/ARP operation. Route AD, hostname, and a default summary do not address the local adjacency."
    ],
    [
      "A router receives a frame for its own MAC, decrements TTL, and selects a connected Ethernet route to the destination network. Which two actions are expected before transmission to the destination host?",
      [
        "Resolve the destination host's MAC with ARP if it is not cached",
        "Preserve the incoming Ethernet source and destination MAC addresses",
        "Construct a new Ethernet header using the outgoing interface's MAC as source",
        "Set TTL to its original value",
        "ARP for the original source host on the outgoing segment"
      ],
      [
        0,
        2
      ],
      "Explanation: On a connected Ethernet destination network, the router resolves the destination host's MAC if needed and emits a new frame with its own egress MAC as source. It does not preserve the incoming header or restore TTL."
    ],
    {
      "type": "dnd",
      "question": "Match each route code from show ip route with its meaning.",
      "pairs": [
        [
          "C",
          "Directly connected"
        ],
        [
          "S",
          "Static route"
        ],
        [
          "O",
          "OSPF-learned route"
        ],
        [
          "R",
          "RIP-learned route"
        ]
      ],
      "explanation": "Explanation: Cisco IOS route codes identify the source: C is connected, S is static, O is OSPF, and R is RIP."
    },
    {
      "type": "dnd",
      "question": "Match each IOS interface state with the usual interpretation.",
      "pairs": [
        [
          "administratively down/down",
          "Disabled by configuration"
        ],
        [
          "up/down",
          "Physical link up, line protocol down"
        ],
        [
          "down/down",
          "Physical link not detected"
        ],
        [
          "up/up",
          "Physical and line protocol operational"
        ]
      ],
      "explanation": "Explanation: The first field reflects interface/physical state and the second is line protocol; administratively down specifically means shutdown is configured."
    },
    {
      "type": "dnd",
      "question": "Match each routing concept to the comparison it performs.",
      "pairs": [
        [
          "Longest-prefix match",
          "Selects the most-specific matching destination prefix"
        ],
        [
          "Administrative distance",
          "Ranks route sources for the same destination prefix"
        ],
        [
          "Routing protocol metric",
          "Ranks paths within a routing protocol"
        ],
        [
          "Floating static route",
          "Uses higher AD to remain backup to another route"
        ]
      ],
      "explanation": "Explanation: Forwarding uses prefix specificity; route source AD and protocol metric govern different route-selection comparisons, while a floating static route has deliberately higher AD."
    },
    {
      "type": "dnd",
      "question": "Match each IPv6 static route destination with its route scope.",
      "pairs": [
        [
          "::/0",
          "Default route"
        ],
        [
          "2001:db8:1::/64",
          "Subnet route"
        ],
        [
          "2001:db8:1::9/128",
          "Host route"
        ]
      ],
      "explanation": "Explanation: ::/0 matches any IPv6 destination not matched by a longer prefix, /64 represents a typical subnet, and /128 matches exactly one address."
    },
    {
      "type": "dnd",
      "question": "Match each diagnostic symptom with the most likely first focus.",
      "pairs": [
        [
          "Ping by IP succeeds, hostname fails",
          "DNS name resolution"
        ],
        [
          "Remote ping fails, local neighbor responds",
          "Forward and return routes or filtering"
        ],
        [
          "Interface administratively down",
          "Enable with no shutdown"
        ],
        [
          "Traceroute has missing intermediate hops but destination responds",
          "Intermediate ICMP filtering or rate limiting"
        ]
      ],
      "explanation": "Explanation: Each symptom points to a distinct troubleshooting layer: name resolution, remote routing/filtering, interface configuration, or traceroute response policy."
    }
  ]
});
