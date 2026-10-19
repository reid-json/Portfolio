examPool.push({
  domain: "security-fundamentals",
  items: [
  [
    "A finance employee enters a password on a counterfeit sign-in page, and an attacker later uses it from an unfamiliar network. Which control most directly prevents the password alone from granting access?",
    [
      "Require multifactor authentication",
      "Enable DHCP snooping",
      "Hide the wireless SSID",
      "Use a standard ACL on the LAN"
    ],
    [
      0
    ],
    "MFA requires an additional factor, so a stolen password alone is insufficient. DHCP snooping and a LAN ACL do not protect the cloud sign-in, while a hidden SSID is not authentication."
  ],
  [
    "A server receives a flood of TCP SYNs with spoofed sources and accumulates half-open connections. What attack is occurring?",
    [
      "Credential stuffing",
      "SYN-flood denial of service",
      "VLAN hopping",
      "DNS cache poisoning"
    ],
    [
      1
    ],
    "An excess of incomplete TCP handshakes consumes connection state and characterizes a SYN flood. Credential stuffing uses reused passwords; VLAN hopping and DNS poisoning exploit unrelated mechanisms."
  ],
  [
    "Network administrators need centralized authentication, per-command authorization, and accounting. Which AAA protocol is the best fit when packet-body encryption and TCP transport are desired?",
    [
      "RADIUS over UDP",
      "SNMPv3",
      "TACACS+ over TCP",
      "TFTP over UDP"
    ],
    [
      2
    ],
    "TACACS+ uses TCP, encrypts the packet body, and supports granular command authorization. RADIUS commonly uses UDP and typically encrypts only the password field; SNMP and TFTP are not AAA protocols."
  ],
  [
    "A branch gateway must create a protected tunnel to a headquarters gateway over the public Internet, providing peer authentication, integrity, and confidentiality. Which technology best fits?",
    [
      "A GRE tunnel alone",
      "A standard IPv4 ACL",
      "Port security",
      "IPsec VPN"
    ],
    [
      3
    ],
    "IPsec can authenticate peers and protect traffic integrity and confidentiality for a site-to-site VPN. GRE alone does not encrypt, while ACLs and port security do not establish protected tunnels."
  ],
  [
    "Employees must authenticate to Wi-Fi with individual credentials checked by a RADIUS service rather than a shared passphrase. Which approach is appropriate?",
    [
      "WPA2-Enterprise with 802.1X",
      "WPA2-Personal with a shared PSK",
      "Open authentication and MAC filtering",
      "WEP with rotating keys"
    ],
    [
      0
    ],
    "WPA2-Enterprise uses 802.1X/EAP with a backend authentication service for per-user access. Personal mode uses a shared PSK; MAC filtering and WEP do not provide this identity-based security."
  ],
  [
    "A router must protect privileged EXEC access and accept only SSH for remote CLI management. Which TWO actions are appropriate?",
    [
      "Configure an enable secret",
      "Set VTY transport input to telnet",
      "Set a domain name and generate RSA keys",
      "Use VTY login without any credential source",
      "Store credentials in clear text"
    ],
    [
      0,
      2
    ],
    "An enable secret protects privileged EXEC, and SSH key generation requires an identity configuration such as hostname/domain name plus RSA keys. Telnet is plaintext, and remote lines need a valid credential source."
  ],
  [
    "A standard ACL should block source 172.20.4.0/24 from reaching one server subnet, but not block that source from unrelated destinations. Where is usual placement?",
    [
      "Near the source, inbound",
      "Near the destination, outbound",
      "On every interface in both directions",
      "As an outbound IPv6 ACL on the server"
    ],
    [
      1
    ],
    "A standard ACL matches only source addresses, so placing it close to the destination reduces collateral blocking of that source toward other destinations. Extended ACLs are generally placed close to the source."
  ],
  [
    "Which wildcard mask matches exactly one host, 10.4.8.19, in an IPv4 ACL?",
    [
      "0.0.0.255",
      "0.0.255.255",
      "0.0.0.0",
      "255.255.255.255"
    ],
    [
      2
    ],
    "Wildcard zero requires every address bit to match, selecting exactly 10.4.8.19. The other masks match a subnet, a larger range, or any address."
  ],
  [
    "An inbound ACL contains: 10 permit tcp 10.10.0.0 0.0.255.255 host 192.0.2.80 eq 443\n20 deny ip any host 192.0.2.80\n30 permit ip any any\nWhat happens to UDP from 10.10.5.7 to 192.0.2.80 port 443?",
    [
      "It is permitted by 10",
      "It is permitted by 30",
      "It hits implicit deny before 20",
      "It is denied by 20"
    ],
    [
      3
    ],
    "Sequence 10 permits only TCP to destination port 443. The UDP packet next matches the sequence 20 deny for all IP traffic to the host; first-match processing stops there."
  ],
  [
    "An extended ACL must permit UDP DNS queries from 10.1.0.0/16 to resolver 10.9.0.53 on port 53. Which ACE is correct?",
    [
      "permit udp 10.1.0.0 0.0.255.255 host 10.9.0.53 eq 53",
      "permit ip host 10.9.0.53 10.1.0.0 0.0.255.255",
      "permit tcp 10.1.0.0 0.0.255.255 host 10.9.0.53 eq 53",
      "permit udp 10.1.0.0 255.255.0.0 host 10.9.0.53 eq 53"
    ],
    [
      0
    ],
    "This ACE specifies UDP, the correct source range, resolver destination, and destination port 53. The other choices reverse endpoints, select TCP, or use a subnet mask where IOS expects wildcard bits."
  ],
  [
    "A port-security interface has maximum 2 and two secure MACs learned. A third MAC sends a frame while violation mode is shutdown. What happens?",
    [
      "The third MAC is added and the port stays up",
      "The interface enters error-disabled state",
      "The frame is dropped and logged, but port stays up",
      "The third MAC replaces the oldest secure address"
    ],
    [
      1
    ],
    "Shutdown mode takes the interface to error-disabled when a secure MAC limit is exceeded. Protect drops without notification; restrict drops and records/counts violations while leaving the port up."
  ],
  [
    "A switch uses DHCP snooping and DAI. Which TWO statements describe the correct trust and validation model?",
    [
      "DAI can check ARP bindings against the DHCP snooping database",
      "User-facing ports should trust DHCP server replies",
      "The authorized DHCP-server-facing uplink is typically trusted",
      "DHCP snooping trusts all access ports by default",
      "DAI validates TCP ports against DHCP leases"
    ],
    [
      0,
      2
    ],
    "DAI can validate ARP sender mappings against snooping bindings, and server-facing uplinks are trusted for authorized DHCP replies. Client ports are normally untrusted; DAI checks ARP rather than TCP."
  ],
  [
    "A company connects two office LANs through their gateway routers over the Internet. Which VPN type describes this?",
    [
      "Remote-access VPN",
      "Clientless portal",
      "Site-to-site VPN",
      "SSL inspection proxy"
    ],
    [
      2
    ],
    "A site-to-site VPN protects traffic between network gateways, connecting routed networks. Remote-access serves individual clients; a portal or proxy is not a gateway-to-gateway VPN."
  ],
  [
    "An organization wants password-based Wi-Fi protection that resists offline guessing from a captured exchange and supports modern protected management frames. Which is strongest if clients support it?",
    [
      "WEP",
      "WPA2-Personal with TKIP",
      "Open authentication with MAC filtering",
      "WPA3-Personal with SAE"
    ],
    [
      3
    ],
    "WPA3-Personal uses SAE to improve resistance to offline dictionary attacks and requires protected management frames. WEP and TKIP are obsolete, while MAC filtering is not cryptographic authentication."
  ],
  [
    "Which IOS fragment creates a local user and makes VTY lines use that local account while accepting SSH only?",
    [
      "username netadmin secret S3cure\nline vty 0 4\n login local\n transport input ssh",
      "username netadmin password S3cure\nline vty 0 4\n login\n transport input telnet",
      "line vty 0 4\n password S3cure\n login local\n transport output ssh",
      "ip ssh version 2\nline console 0\n login local\n transport input ssh"
    ],
    [
      0
    ],
    "The local secret, login local, and transport input ssh combination authenticates remote users and permits SSH only. The other fragments leave Telnet enabled or apply commands incorrectly."
  ],
  [
    "An ACL is configured as: access-list 15 deny 10.8.0.0 0.0.255.255\naccess-list 15 permit 10.8.4.0 0.0.0.255\naccess-list 15 permit any\nWhat happens to a packet sourced from 10.8.4.9?",
    [
      "Permitted by the more-specific second ACE",
      "Denied by the first ACE",
      "Permitted by permit any",
      "Denied only if destination is in 10.8.0.0/16"
    ],
    [
      1
    ],
    "ACLs use first-match order, not longest-prefix selection. The address 10.8.4.9 is within the first denied /16, so later permits are not examined."
  ],
  [
    "An organization sees low-rate login attempts using leaked username/password pairs across many accounts. Which TWO measures directly reduce credential-stuffing risk?",
    [
      "Require multifactor authentication",
      "Enable dynamic ARP inspection",
      "Rate-limit attempts and detect breached passwords",
      "Disable DHCP snooping",
      "Use an open guest WLAN"
    ],
    [
      0,
      2
    ],
    "MFA reduces the value of reused passwords, and rate limiting plus breached-password detection can block or flag stuffing. ARP inspection and DHCP snooping target LAN threats, not online password reuse."
  ],
  [
    "An outbound extended ACL permits TCP from 10.20.1.0/24 to 10.30.0.10 port 22, then denies IP from any to that host, then permits other IP. Which packet is permitted?",
    [
      "UDP from 10.20.1.5 to 10.30.0.10 port 22",
      "TCP from 10.20.2.5 to 10.30.0.10 port 22",
      "TCP from 10.20.1.5 to 10.30.0.10 port 22",
      "ICMP from 10.20.1.5 to 10.30.0.10"
    ],
    [
      2
    ],
    "Only the TCP packet from the specified subnet to the server on destination port 22 matches the first permit. The other packets miss it and match the host-specific IP deny."
  ],
  [
    "An engineer uses a standard ACL to permit 192.168.40.0/24. What is true of a packet with a source in that subnet?",
    [
      "It is allowed only if TCP",
      "It is allowed only when destined to 192.168.40.0/24",
      "It is denied because the wildcard is nonzero",
      "It is permitted regardless of destination, while unmatched sources hit implicit deny"
    ],
    [
      3
    ],
    "A standard ACL matches the source address only and does not constrain destination or protocol. Any source that misses the permit reaches the implicit deny."
  ],
  [
    "An access switch learns a client MAC dynamically; the administrator wants it retained as a secure address and limits the port to one MAC. Which configuration intent is correct?",
    [
      "Set maximum 1 and enable sticky secure MAC learning",
      "Set maximum 1 and trust DHCP server messages",
      "Enable DAI and set maximum 0",
      "Use restrict mode without enabling port security"
    ],
    [
      0
    ],
    "Sticky learning retains a dynamically learned address as a secure sticky MAC, while maximum 1 limits the number. DHCP trust and DAI do not configure port-security learning."
  ],
  [
    "A campus needs to permit DHCP server responses only from authorized infrastructure. Which TWO snooping measures are appropriate?",
    [
      "Enable DHCP snooping globally and on the client VLANs",
      "Trust all end-user ports",
      "Trust the authorized DHCP-server-facing uplink",
      "Disable the snooping binding table",
      "Use an ARP ACL instead of snooping"
    ],
    [
      0,
      2
    ],
    "DHCP snooping must be enabled globally and per VLAN, and authorized server-facing interfaces are trusted. User access ports should remain untrusted so rogue server replies are blocked."
  ],
  [
    "A firewall should allow return packets for inside-initiated sessions without maintaining separate rules for every ephemeral source port. Which behavior is required?",
    [
      "Stateless source filtering",
      "Stateful connection tracking",
      "Sticky MAC learning",
      "DHCP option 82 insertion"
    ],
    [
      1
    ],
    "Stateful inspection tracks permitted connections and recognizes their valid return traffic. Stateless ACLs evaluate packets independently and usually require explicit reverse-direction policy."
  ],
  [
    "A device must automatically block matching malicious network packets inline, despite the possibility of false positives. What placement is needed?",
    [
      "Passive IDS tap",
      "Syslog collector",
      "Inline IPS in the traffic path",
      "DNS cache"
    ],
    [
      2
    ],
    "An IPS sits inline so it can drop traffic as it passes. A passive IDS or log collector can alert but cannot directly stop forwarded packets."
  ],
  [
    "Two administrators need distinct privilege and an audit trail of commands run, with centralized policy. Which TWO AAA choices best address that?",
    [
      "Use TACACS+ command authorization",
      "Share one enable password and identify users by IP",
      "Enable accounting for command execution",
      "Use RADIUS without accounting and infer commands from counters",
      "Keep credentials in a plaintext shared file"
    ],
    [
      0,
      2
    ],
    "TACACS+ supports granular command authorization, and accounting records administrator actions. Shared credentials reduce attribution, while interface counters cannot reconstruct commands."
  ],
  [
    "A permit should allow TCP from 172.16.12.0/24 to any destination on port 443. Which extended ACL statement is correct?",
    [
      "permit tcp any eq 443 172.16.12.0 0.0.0.255",
      "permit ip 172.16.12.0 255.255.255.0 any",
      "permit udp 172.16.12.0 0.0.0.255 any eq 443",
      "permit tcp 172.16.12.0 0.0.0.255 any eq 443"
    ],
    [
      3
    ],
    "The source subnet and wildcard precede destination any and destination port 443. Option B reverses the fields, C uses a subnet mask and all IP protocols, and D selects UDP."
  ],
  [
    "An ACL reads: 10 permit tcp any host 203.0.113.20 eq 80\n20 deny ip any host 203.0.113.20\n30 permit ip any any\nWhat happens to TCP destined for 203.0.113.20 port 443?",
    [
      "Denied by sequence 20",
      "Permitted by sequence 10",
      "Permitted by sequence 30",
      "Denied by implicit deny before 20"
    ],
    [
      0
    ],
    "The first ACE permits TCP only to port 80. Port 443 misses that line and matches the second ACE denying all IP traffic to the host."
  ],
  [
    "Which statement correctly distinguishes WPA2-Enterprise from WPA2-Personal?",
    [
      "Enterprise uses no authentication; Personal uses RADIUS for each user",
      "Enterprise uses 802.1X/EAP and a backend server; Personal commonly uses a shared PSK",
      "Enterprise requires WEP; Personal requires IPsec",
      "Enterprise is MAC filtering; Personal always requires certificates"
    ],
    [
      1
    ],
    "WPA2-Enterprise uses 802.1X/EAP and a backend authentication server, whereas Personal mode uses a shared pre-shared key. The other options confuse or misstate these methods."
  ],
  [
    "Which IOS configuration uses a protected privileged EXEC secret and removes Telnet from VTY management?",
    [
      "enable password Secret\nline vty 0 4\n transport input telnet",
      "service password-encryption\nline vty 0 4\n transport output ssh",
      "enable secret Secret\nline vty 0 4\n transport input ssh",
      "enable secret Secret\nline vty 0 4\n transport input all"
    ],
    [
      2
    ],
    "Enable secret is the preferred privileged EXEC credential, and transport input ssh permits only SSH on VTY lines. Telnet remains enabled in choices A and D; transport output is not the inbound restriction."
  ],
  [
    "Which wildcard mask matches 198.51.100.64/27 exactly?",
    [
      "0.0.0.32",
      "0.0.0.63",
      "255.255.255.224",
      "0.0.0.31"
    ],
    [
      3
    ],
    "A /27 leaves five host bits, so the wildcard is 0.0.0.31. The .63 wildcard covers a /26, and 255.255.255.224 is a subnet mask, not the required wildcard."
  ],
  [
    "A named ACL has sequence numbers 10, 20, and 30. A specific permit must be added ahead of a broader deny. How should it be inserted?",
    [
      "Insert an ACE with an appropriate sequence number before the deny",
      "Append it after sequence 30 and rely on longest-prefix matching",
      "Create another ACL with the same name",
      "Convert it to standard so IOS reorders it"
    ],
    [
      0
    ],
    "Named ACL sequence numbering allows insertion before a broader deny. ACLs do not use longest-prefix selection, and an ACE after a matching deny cannot override that deny."
  ],
  [
    "An attacker sends forged ARP replies claiming the gateway IP belongs to the attacker's MAC. Which TWO controls most directly reduce this risk?",
    [
      "Enable DAI using DHCP snooping bindings",
      "Deploy only a stateful Internet firewall",
      "Use ARP ACL entries for legitimate static devices where needed",
      "Apply a standard ACL to the WAN",
      "Enable WPA3 only on a separate WLAN"
    ],
    [
      0,
      2
    ],
    "DAI validates ARP claims against bindings, while ARP ACL entries can authorize legitimate static mappings. WAN firewalls and IP ACLs do not inspect ARP claims on the local segment."
  ],
  [
    "A public server must accept HTTPS but must not initiate arbitrary new connections to clients. Responses to permitted inbound HTTPS should work. What policy is suitable?",
    [
      "Allow all traffic both ways",
      "Use stateful inspection with scoped HTTPS rules and tracked return traffic",
      "Allow outbound all TCP and deny only UDP",
      "Trust the server port for DHCP snooping"
    ],
    [
      1
    ],
    "A stateful, scoped policy can allow intended HTTPS and related responses without allowing unrelated new connections. Broad bidirectional access fails the policy; DHCP snooping is unrelated."
  ],
  [
    "Clients cannot lease addresses after snooping is enabled; DHCP server replies arrive on an untrusted uplink and are dropped. What is the direct correction?",
    [
      "Enable ip arp inspection trust on client ports",
      "Disable snooping on the VLAN",
      "Configure the authorized server-facing interface with ip dhcp snooping trust",
      "Add a permit ACE to an unrelated ACL"
    ],
    [
      2
    ],
    "The legitimate server-facing interface must be trusted for server messages to pass snooping checks. DAI trust and ACL permits do not change DHCP snooping's interface trust state."
  ],
  [
    "Which statement about an IPsec site-to-site design is accurate?",
    [
      "An IPsec association can be created only by a standard ACL",
      "GRE guarantees confidentiality on its own",
      "IPsec authenticates peers but cannot provide data integrity",
      "A crypto ACL commonly identifies interesting traffic but does not itself encrypt it"
    ],
    [
      3
    ],
    "A crypto ACL classifies traffic for protection; IPsec provides cryptographic services. GRE alone does not encrypt, and IPsec supports integrity as well as confidentiality and authentication."
  ],
  [
    "A guest WLAN needs per-user identity and centralized policy. Which TWO mechanisms directly support this?",
    [
      "An 802.1X supplicant on the client",
      "A RADIUS server for backend authentication",
      "One WPA2-Personal key shared by all guests",
      "DHCP snooping as the identity authority",
      "Hidden SSID and MAC filtering"
    ],
    [
      0,
      1
    ],
    "The supplicant participates in 802.1X, and the authenticator relays EAP exchanges to a RADIUS backend that can apply identity policy. A shared PSK, hidden SSID, or DHCP snooping is not per-user authentication."
  ],
  [
    "IOS reports that RSA key generation for SSH requires a domain name. Which configuration addition is expected?",
    [
      "ip domain-name example.net",
      "ip name-server 192.0.2.53",
      "service password-encryption",
      "transport input ssh"
    ],
    [
      0
    ],
    "IOS commonly uses the configured hostname and ip domain-name as part of the RSA key identity. DNS server configuration and VTY transport settings do not satisfy that prerequisite."
  ],
  [
    "An endpoint has a software flaw that can be exploited by a remote attacker. Which risk term describes the software flaw?",
    [
      "Threat actor",
      "Vulnerability",
      "Exploit",
      "Mitigation"
    ],
    [
      1
    ],
    "A vulnerability is a weakness in a system that a threat may exploit. An attacker is an actor, an exploit is a method or code, and a mitigation reduces risk."
  ],
  [
    "A wired 802.1X deployment blocks a laptop until identity checks finish. Which network device role controls the switch port and relays EAP exchanges to the authentication server?",
    [
      "Supplicant",
      "DHCP relay",
      "Authenticator",
      "Accounting server"
    ],
    [
      2
    ],
    "The switch is the authenticator: it controls access at the port and relays EAP to the server. The endpoint is the supplicant; DHCP relay does not perform 802.1X access control."
  ],
  [
    "An extended ACL permits only UDP from 10.7.0.0/16 to resolver 192.0.2.53 on destination port 53. What happens to UDP from 10.7.4.11 to that host on port 5353 if no other ACE matches?",
    [
      "It is permitted because both ports serve DNS",
      "It is permitted because the host matches",
      "It is denied only if it is TCP",
      "It is denied by a following deny or implicit deny"
    ],
    [
      3
    ],
    "An eq 53 ACE does not match destination port 5353. If no other permit matches, the packet is rejected by an explicit later deny or the implicit deny."
  ],
  [
    "An ACL contains permit tcp any host 198.51.100.8 established followed by deny ip any any. What does established match?",
    [
      "TCP packets with ACK or RST set; it is not full state tracking",
      "A complete valid TCP session in a firewall state table",
      "UDP replies associated with an inside session",
      "Every TCP packet to that host"
    ],
    [
      0
    ],
    "The established keyword tests TCP ACK or RST flags and is a stateless test, not a tracked handshake. It does not match UDP or every TCP packet."
  ],
  [
    "A statically addressed printer fails DAI because its mapping is absent from the DHCP snooping table. Which change preserves ARP validation for this device?",
    [
      "Trust all ports in its VLAN",
      "Add an appropriate ARP ACL or supported static binding",
      "Disable DAI globally",
      "Add the printer IP to a standard ACL"
    ],
    [
      1
    ],
    "A static host may have no DHCP binding, so a valid ARP ACL or static binding can authorize its mapping. Broad trust or disabling DAI removes protection, and an IP ACL does not validate ARP."
  ],
  [
    "Remote staff connect individually from home laptops to internal applications over an authenticated encrypted tunnel. Which service type is being used?",
    [
      "Site-to-site VPN",
      "Dynamic ARP inspection",
      "Remote-access VPN",
      "Standard ACL"
    ],
    [
      2
    ],
    "Remote-access VPNs provide individual users a protected connection to an organization. Site-to-site VPNs link gateways; DAI and ACLs do not create tunnels."
  ],
  [
    "A security team wants to detect scans with minimal risk of disrupting live traffic. Where should a network IDS receive traffic?",
    [
      "Inline with blocking enabled",
      "On a trusted DHCP server uplink",
      "As a VTY line transport option",
      "On a passive tap or SPAN feed"
    ],
    [
      3
    ],
    "A passive tap or SPAN feed lets an IDS observe and alert without forwarding or blocking production traffic. Inline blocking is characteristic of IPS deployment."
  ],
  [
    "Which command fragment defines a named standard ACL that permits only 10.44.8.0/24?",
    [
      "ip access-list standard MGMT-SOURCES\n permit 10.44.8.0 0.0.0.255",
      "ip access-list extended MGMT-SOURCES\n permit tcp 10.44.8.0 255.255.255.0 any",
      "access-list MGMT-SOURCES standard permit 10.44.8.0 0.0.0.255",
      "ip access-group standard MGMT-SOURCES\n permit host 10.44.8.0"
    ],
    [
      0
    ],
    "A named standard ACL starts with ip access-list standard NAME; its permit line matches the source using wildcard 0.0.0.255. The other forms use invalid syntax or an incorrect mask type."
  ],
  [
    "An inline IPS repeatedly blocks legitimate traffic due to one noisy signature. Which operational change reduces false-positive impact without abandoning detection?",
    [
      "Move to passive monitoring but claim it still blocks inline",
      "Tune or suppress that signature and review its alerts",
      "Permit all traffic at the perimeter",
      "Disable all logging and updates"
    ],
    [
      1
    ],
    "Tuning a specific signature can reduce false positives while retaining other detection. A passive IDS cannot block, and broad permits or disabling logs and updates weakens security."
  ],
  [
    "An outbound extended ACL must deny all IP from 10.90.0.0/16 to host 203.0.113.44, then permit other traffic. Which ACE pair is correct?",
    [
      "deny tcp host 203.0.113.44 10.90.0.0 0.0.255.255\npermit ip any any",
      "permit ip 10.90.0.0 0.0.255.255 host 203.0.113.44\ndeny ip any any",
      "deny ip 10.90.0.0 0.0.255.255 host 203.0.113.44\npermit ip any any",
      "deny ip 10.90.0.0 255.255.0.0 host 203.0.113.44\npermit ip any any"
    ],
    [
      2
    ],
    "The first ACE has source subnet and wildcard, destination host, and protocol ip, followed by a catch-all permit. Other choices reverse addresses, permit instead of deny, or use a subnet mask."
  ],
  [
    "An attacker sends requests to open DNS resolvers with a victim's spoofed source address; the resolvers send larger responses to the victim. What is this attack?",
    [
      "ARP cache poisoning",
      "Password spraying",
      "Rogue DHCP",
      "DNS reflection/amplification DoS"
    ],
    [
      3
    ],
    "Spoofed source requests cause third-party resolvers to reflect amplified responses toward a victim. The other attacks manipulate ARP, test passwords, or alter DHCP configuration."
  ],
  [
    "An inside host starts an allowed HTTPS session through a stateful firewall. A matching response arrives from the web server in the expected connection state. What should normally happen?",
    [
      "Permit it as tracked return traffic",
      "Drop it regardless of connection state",
      "Treat it as a new outbound flow",
      "Reclassify it as ARP"
    ],
    [
      0
    ],
    "A stateful firewall normally admits valid packets belonging to an allowed tracked session. It does not need to treat the response as a new connection or as an ARP message."
  ],
  [
    "A port-security interface is in protect mode and has reached its maximum secure MAC count. A frame arrives from a new MAC. What occurs?",
    [
      "The interface becomes error-disabled",
      "The unauthorized frame is dropped and the port stays up, generally with little notification",
      "The frame is forwarded and the MAC is learned",
      "The oldest secure MAC is replaced automatically"
    ],
    [
      1
    ],
    "Protect drops frames from violating MAC addresses but keeps the interface up, generally with minimal logging. Shutdown disables the port; restrict adds violation counters and possible notifications."
  ],
  [
    "Which statement accurately describes TACACS+?",
    [
      "RADIUS commonly uses UDP and encrypts the password field",
      "TACACS+ uses only UDP and encrypts only passwords",
      "TACACS+ uses TCP and encrypts the packet body",
      "RADIUS always supports separate command authorization"
    ],
    [
      2
    ],
    "RADIUS commonly uses UDP and protects the password field; TACACS+ uses TCP and encrypts the packet body. TACACS+ supports command authorization, and both provide centralized AAA."
  ],
  [
    "A standard ACL permits source 10.1.2.0/24 inbound on a router WAN interface. Why can that source reach multiple destinations and services?",
    [
      "The ACL implicitly permits every TCP service",
      "The wildcard expands to all destinations",
      "Inbound ACLs affect only packets addressed to the router",
      "Standard ACLs match source only, not destination or port"
    ],
    [
      3
    ],
    "A standard ACL matches the source IPv4 address only. It does not constrain destination or service, so other policy controls determine whether those flows proceed."
  ],
  [
    "A lab uses one shared WPA2-Personal passphrase, but policy requires revoking one employee without changing other users' credentials. What migration best supports this?",
    [
      "Use 802.1X Enterprise authentication with individual identities",
      "Keep the PSK and hide the SSID",
      "Use MAC filtering as the only credential",
      "Email a longer shared PSK"
    ],
    [
      0
    ],
    "802.1X Enterprise authentication supports individual credentials that can be revoked centrally. Hiding an SSID or filtering MAC addresses does not replace per-user authentication."
  ],
  [
    "Why is an extended ACL often applied near the source network?",
    [
      "It automatically permits return traffic",
      "It can discard unwanted packets before they consume capacity across the network",
      "It evaluates destination before source",
      "It can only be applied inbound"
    ],
    [
      1
    ],
    "Extended ACLs can match multiple packet fields and are often placed near the source to stop unwanted traffic early. ACL placement does not create state tracking or force a direction."
  ],
  [
    "A network device requires an encrypted interactive CLI and a stronger privileged EXEC credential. Which pair meets those goals?",
    [
      "Telnet and enable password",
      "HTTP and a line password",
      "SSH and enable secret",
      "TFTP and service password-encryption"
    ],
    [
      2
    ],
    "SSH encrypts interactive management traffic, and enable secret is the preferred protected privileged EXEC credential. Telnet is plaintext, and the other protocols do not meet both requirements."
  ],
  {
    "type": "dnd",
    "question": "Match each attack pattern to the behavior that defines it.",
    "pairs": [
      [
        "Credential stuffing",
        "Testing leaked username-password pairs across accounts"
      ],
      [
        "Phishing",
        "Impersonating a trusted sender to induce disclosure"
      ],
      [
        "Denial of service",
        "Overwhelming a service to block legitimate use"
      ],
      [
        "Rogue access point",
        "Unauthorized wireless infrastructure imitating or joining a trusted WLAN"
      ]
    ],
    "explanation": "Credential stuffing tests reused credentials, phishing deceives users, denial of service exhausts availability, and a rogue access point introduces unauthorized wireless connectivity."
  },
  {
    "type": "dnd",
    "question": "Match each AAA element to its characteristic.",
    "pairs": [
      [
        "RADIUS",
        "Commonly uses UDP and protects the password field"
      ],
      [
        "TACACS+",
        "Uses TCP and encrypts the packet body"
      ],
      [
        "Accounting",
        "Records resource use or administrator actions"
      ],
      [
        "Command authorization",
        "Controls which CLI commands a user may execute"
      ]
    ],
    "explanation": "RADIUS and TACACS+ differ in transport and encryption scope; accounting records activity, while authorization determines which actions are permitted."
  },
  {
    "type": "dnd",
    "question": "Match each VPN description to the corresponding type or technology.",
    "pairs": [
      [
        "An individual employee connects from a laptop",
        "Remote-access VPN"
      ],
      [
        "Two office gateways protect traffic between LANs",
        "Site-to-site VPN"
      ],
      [
        "IP-layer authentication and encryption suite",
        "IPsec"
      ],
      [
        "Encapsulation with no inherent confidentiality",
        "GRE"
      ]
    ],
    "explanation": "Remote access serves individual clients, site-to-site joins networks through gateways, IPsec protects IP traffic, and GRE alone only encapsulates."
  },
  {
    "type": "dnd",
    "question": "Match each wireless security mode to its authentication model.",
    "pairs": [
      [
        "WPA2-Personal",
        "Shared pre-shared key"
      ],
      [
        "WPA2-Enterprise",
        "802.1X/EAP with a backend authentication server"
      ],
      [
        "WPA3-Personal",
        "SAE-based password authentication"
      ],
      [
        "Open WLAN",
        "No link-layer authentication or encryption by default"
      ]
    ],
    "explanation": "Personal modes use password-based shared-key methods, Enterprise uses 802.1X/EAP, and an open WLAN lacks default link-layer authentication and encryption."
  },
  {
    "type": "dnd",
    "question": "Match each switch security feature or mode to its function.",
    "pairs": [
      [
        "Port security sticky",
        "Retains learned source MAC addresses as secure entries"
      ],
      [
        "Violation shutdown",
        "Places the interface in an error-disabled state"
      ],
      [
        "DHCP snooping",
        "Filters untrusted server messages and builds lease bindings"
      ],
      [
        "Dynamic ARP inspection",
        "Validates ARP claims using trusted bindings or ARP ACLs"
      ]
    ],
    "explanation": "Sticky port security retains learned MACs, shutdown disables a violating port, snooping filters DHCP and records bindings, and DAI checks ARP claims."
  },
  {
    "type": "dnd",
    "question": "Match each ACL concept to its proper interpretation.",
    "pairs": [
      [
        "Standard IPv4 ACL",
        "Matches source address only"
      ],
      [
        "Extended IPv4 ACL",
        "Can match source, destination, protocol, and ports"
      ],
      [
        "Wildcard bit zero",
        "Requires the corresponding address bit to match"
      ],
      [
        "Implicit deny",
        "Rejects traffic reaching the end without a match"
      ]
    ],
    "explanation": "Standard ACLs are source-focused, extended ACLs inspect additional fields, a wildcard zero means exact bit matching, and unmatched packets are denied at the end."
  }
]
});
