examPool.push({
  "domain": "network-access",
  "items": [
    [
      "A workstation on Gi0/7 must be placed in VLAN 34, which already exists. Which command sequence assigns the port as a static access port?",
      [
        "switchport mode access; switchport access vlan 34",
        "switchport mode trunk; switchport native vlan 34",
        "switchport trunk allowed vlan 34; switchport mode dynamic auto",
        "switchport access vlan 34; switchport mode dynamic desirable"
      ],
      [
        0
      ],
      "Explanation: Static access mode with switchport access vlan assigns the endpoint to VLAN 34. Trunk commands configure tagged links, and dynamic modes negotiate trunking rather than guaranteeing an access port."
    ],
    [
      "An administrator runs show vlan brief and sees VLAN 34 listed, but Gi0/7 is absent from the port list. The connected host has no connectivity to VLAN 34 peers. What is the most direct explanation?",
      [
        "The VLAN is missing from the VTP pruning list",
        "The VLAN exists, but Gi0/7 is not configured as an access member of it",
        "The port has negotiated a 100-Mb/s half-duplex link",
        "The switch has elected the wrong STP root"
      ],
      [
        1
      ],
      "Explanation: show vlan brief associates access ports with VLANs; a listed VLAN with no Gi0/7 indicates the port is not assigned there. Speed, pruning, and root selection do not explain the missing access-port association."
    ],
    [
      "Two switches have an 802.1Q trunk. Users in VLAN 22 work locally but cannot reach users in VLAN 22 across the link. show interfaces trunk lists VLAN 22 under allowed VLANs but not under active VLANs. What should be checked first?",
      [
        "Whether the trunk has PortFast enabled",
        "Whether the SVI uses an address from VLAN 22",
        "Whether VLAN 22 exists and is active in the local VLAN database",
        "Whether the remote switch has a lower bridge priority"
      ],
      [
        2
      ],
      "Explanation: A VLAN must exist and be active locally before it can be active on a trunk. PortFast, SVI addressing, and bridge priority do not make a missing VLAN active."
    ],
    [
      "A port connected to a single PC is unexpectedly operating as a trunk. Which configuration most deterministically prevents trunk negotiation on that port?",
      [
        "switchport nonegotiate",
        "switchport trunk encapsulation dot1q",
        "switchport trunk native vlan 1",
        "switchport mode access"
      ],
      [
        3
      ],
      "Explanation: switchport mode access statically fixes the port in access mode. nonegotiate suppresses DTP but does not itself convert a dynamic port to access; the remaining commands concern trunk settings."
    ],
    [
      "An 802.1Q trunk carries VLANs 10 and 20. Its native VLAN is 99 at one end and 1 at the other. What is the principal operational risk?",
      [
        "Untagged frames can be classified into different VLANs at the two ends",
        "LACP will suspend every member link",
        "The native VLAN is automatically removed from the allowed list",
        "The trunk changes into a routed port"
      ],
      [
        0
      ],
      "Explanation: 802.1Q sends native-VLAN traffic untagged by default, so mismatched native VLANs can place frames into different broadcast domains. The mismatch does not inherently disable LACP, alter allowed VLANs, or route the link."
    ],
    [
      "Which two commands make a point-to-point link a statically configured 802.1Q trunk and set its native VLAN to 88? Choose two.",
      [
        "switchport mode trunk",
        "switchport access vlan 88",
        "switchport trunk native vlan 88",
        "switchport mode dynamic auto",
        "switchport voice vlan 88"
      ],
      [
        0,
        2
      ],
      "Explanation: switchport mode trunk fixes the port in trunk mode, and switchport trunk native vlan 88 selects VLAN 88 for untagged traffic. The other commands configure access, negotiated, or voice VLAN behavior."
    ],
    [
      "A link between switches remains an access link. Both ends use switchport mode dynamic auto. Which change makes DTP negotiation able to form a trunk?",
      [
        "Set both ends to dynamic auto",
        "Set one end to dynamic desirable",
        "Set both ends to switchport nonegotiate",
        "Set one end to switchport access"
      ],
      [
        1
      ],
      "Explanation: Dynamic auto is passive; two auto ports do not initiate trunk negotiation. A desirable port actively negotiates with auto. nonegotiate disables DTP, while access mode prevents trunking."
    ],
    [
      "Gi1/0/24 should carry VLANs 10, 20, and 30 only. Which command configures that allowed list?",
      [
        "switchport access vlan 10,20,30",
        "switchport trunk native vlan 10,20,30",
        "switchport trunk allowed vlan 10,20,30",
        "switchport vlan allowed 10,20,30"
      ],
      [
        2
      ],
      "Explanation: switchport trunk allowed vlan accepts the VLAN list for a trunk. Access and native VLAN commands each take one VLAN, and switchport vlan allowed is not the correct IOS command."
    ],
    [
      "A host in VLAN 40 can ping its router-on-a-stick gateway but cannot reach VLAN 50. The switch trunk allows both VLANs. Which router-side condition is essential?",
      [
        "The physical router interface must have an access VLAN of 40",
        "The router must run DTP desirable on each subinterface",
        "The two subinterfaces must share the same IP address",
        "Separate router subinterfaces must use dot1Q encapsulation for VLANs 40 and 50 and have addresses in their respective subnets"
      ],
      [
        3
      ],
      "Explanation: Router-on-a-stick requires an 802.1Q-tagged subinterface per VLAN, each with an address in that VLAN's subnet. The physical interface is not an access switchport, DTP is not configured on router subinterfaces, and duplicate addressing is invalid."
    ],
    [
      "Which command pair correctly configures router subinterface Gi0/0.50 for VLAN 50 with gateway 192.0.2.1/24?",
      [
        "encapsulation dot1Q 50; ip address 192.0.2.1 255.255.255.0",
        "switchport access vlan 50; ip address 192.0.2.1 255.255.255.0",
        "encapsulation dot1Q 50 native; switchport mode trunk",
        "ip helper-address 192.0.2.1; switchport trunk allowed vlan 50"
      ],
      [
        0
      ],
      "Explanation: On a router subinterface, encapsulation dot1Q 50 associates tagged frames with VLAN 50 and ip address configures its gateway. Switchport commands apply to switch interfaces, not router subinterfaces."
    ],
    [
      "A multilayer switch has a correctly addressed SVI for VLAN 70, but hosts cannot reach it. The VLAN exists and the SVI is administratively up. show ip interface brief reports Vlan70 up/down. What condition is likely missing?",
      [
        "The SVI needs switchport mode trunk",
        "At least one VLAN 70 Layer 2 port must be up and forwarding",
        "The SVI needs encapsulation dot1Q 70",
        "The switch must have a router subinterface for VLAN 70"
      ],
      [
        1
      ],
      "Explanation: An SVI line protocol typically becomes up when the VLAN exists and at least one associated Layer 2 port is operational and forwarding. Trunk and dot1Q subinterface commands are not applied to an SVI."
    ],
    [
      "A campus switch must route between VLAN 11 and VLAN 12 using SVIs. Which global configuration enables IPv4 routing on a typical multilayer Catalyst switch?",
      [
        "ip default-gateway 192.0.2.1",
        "router ospf 1",
        "ip routing",
        "switchport routing"
      ],
      [
        2
      ],
      "Explanation: ip routing enables Layer 3 forwarding between connected VLAN interfaces. ip default-gateway is for a switch operating without IP routing; OSPF is not required for directly connected VLANs."
    ],
    [
      "A PC in VLAN 25 uses 10.25.0.1 as its gateway, but its switch SVI Vlan25 is 10.25.0.254/24. Inter-VLAN traffic fails. What is the best correction?",
      [
        "Change the SVI to an 802.1Q trunk",
        "Set the SVI to switchport mode access",
        "Enable DTP on the SVI",
        "Correct the PC default gateway or SVI addressing so the host uses the actual gateway in its subnet"
      ],
      [
        3
      ],
      "Explanation: The host's configured gateway must be the actual reachable Layer 3 interface address in its subnet. An SVI is not a switchport and does not negotiate trunking."
    ],
    [
      "Which two statements correctly compare router-on-a-stick with SVIs on a multilayer switch? Choose two.",
      [
        "Router-on-a-stick commonly uses VLAN-tagged router subinterfaces on one physical link",
        "SVIs provide Layer 3 interfaces associated with VLANs on the multilayer switch",
        "A router-on-a-stick design requires one physical router interface per VLAN",
        "An SVI is configured with switchport trunk encapsulation",
        "Both designs require DTP to route between VLANs"
      ],
      [
        0,
        1
      ],
      "Explanation: Router-on-a-stick multiplexes VLANs over a trunk using subinterfaces, while an SVI is a virtual Layer 3 interface for a VLAN. Neither design inherently needs one router port per VLAN or DTP for routing."
    ],
    [
      "A technician enters show vlan brief. Which information does the command primarily help verify?",
      [
        "VLAN IDs and names, status, and access ports assigned to each VLAN",
        "Negotiated trunk encapsulation and native VLAN on every interface",
        "Root and designated port roles for each spanning-tree instance",
        "LACP partner system IDs and member synchronization"
      ],
      [
        0
      ],
      "Explanation: show vlan brief summarizes VLAN existence/status and access-port membership. Trunk details, STP roles, and EtherChannel negotiation are inspected with different show commands."
    ],
    [
      "A host moved from VLAN 15 to VLAN 16 but still receives an address from the old subnet. The switchport assignment is correct and its DHCP lease has not expired. What is the most direct next step?",
      [
        "Change the switch native VLAN to 16",
        "Renew the host's DHCP lease after verifying the VLAN 16 scope and relay path",
        "Make the access port a dynamic desirable trunk",
        "Raise the STP priority for VLAN 16"
      ],
      [
        1
      ],
      "Explanation: A client can retain an old DHCP lease after a VLAN move; renew it and verify the VLAN 16 scope/relay. Native VLAN, DTP, and root priority do not refresh the client address."
    ],
    [
      "On SW1, show interfaces trunk reports Gi0/1 trunking with native VLAN 99, but VLAN 99 is absent from the allowed-and-active list. What is the likely issue?",
      [
        "The native VLAN is automatically excluded from the allowed list",
        "Gi0/1 has negotiated LACP passive mode",
        "VLAN 99 is not in the allowed VLAN list or is not active locally",
        "The switch has disabled VLAN tagging globally"
      ],
      [
        2
      ],
      "Explanation: The native VLAN still must be allowed and active. Native status does not inherently exclude VLAN 99, and LACP mode is unrelated."
    ],
    [
      "Examine show interfaces trunk\nPort      Mode   Encapsulation  Status    Native vlan\nGi0/1     on     802.1q         trunking  1\nPort      Vlans allowed on trunk\nGi0/1     10,20,30\nPort      Vlans allowed and active in management domain\nGi0/1     10,20\nPort      Vlans in spanning tree forwarding state and not pruned\nGi0/1     10,20\nWhy is VLAN 30 not currently forwarding over Gi0/1?",
      [
        "VLAN 30 is the native VLAN and is therefore untagged",
        "VLAN 30 is blocked by a mismatch in LACP system priority",
        "The trunk is operating in dynamic auto mode",
        "VLAN 30 is allowed but is not active in the local VLAN management domain"
      ],
      [
        3
      ],
      "Explanation: VLAN 30 appears under allowed but not under allowed-and-active, so it is not active in the local VLAN database. The evidence does not indicate native-VLAN, LACP, or negotiation-mode causes."
    ],
    [
      "A technician sees a native VLAN mismatch log on a trunk, yet ordinary tagged VLAN traffic still passes. What does this indicate?",
      [
        "The native VLAN settings differ, while tagged traffic may continue to be carried",
        "The trunk is actually an access link and cannot carry tagged traffic",
        "All VLANs have been removed from the trunk",
        "The mismatch proves the trunk uses ISL encapsulation"
      ],
      [
        0
      ],
      "Explanation: Native VLAN mismatch affects interpretation of untagged frames; other tagged VLANs may continue forwarding. The message does not mean the trunk is an access link or that all VLANs are removed."
    ],
    [
      "A switch appears in CDP neighbors but not LLDP neighbors. Both devices have CDP enabled. Which explanation is most likely?",
      [
        "CDP advertisements are carried only across routed interfaces",
        "The neighbor may not have LLDP enabled or may not support LLDP",
        "LLDP automatically suppresses CDP on Cisco switches",
        "The switch must enable spanning-tree PortFast on the trunk"
      ],
      [
        1
      ],
      "Explanation: CDP and LLDP are separate discovery protocols; a device can advertise CDP without LLDP. CDP is not limited to routed links, and PortFast is unrelated."
    ],
    [
      "Which command globally enables LLDP on a Cisco IOS switch when LLDP is currently disabled?",
      [
        "cdp run",
        "lldp enable",
        "lldp run",
        "switchport lldp"
      ],
      [
        2
      ],
      "Explanation: lldp run enables LLDP globally on IOS. cdp run is the CDP command; LLDP transmit/receive can then be controlled per interface."
    ],
    [
      "CDP should be disabled only on an external-facing interface while remaining enabled elsewhere. Which interface command is appropriate?",
      [
        "no cdp run",
        "no lldp run",
        "switchport nonegotiate",
        "no cdp enable"
      ],
      [
        3
      ],
      "Explanation: no cdp enable disables CDP on the selected interface. no cdp run disables it globally, no lldp run affects LLDP, and nonegotiate controls DTP."
    ],
    [
      "An access port connects a phone and a workstation. It must send voice VLAN 40 and data VLAN 10 traffic. Which two commands are appropriate? Choose two.",
      [
        "switchport mode access",
        "switchport voice vlan 40",
        "switchport trunk native vlan 40",
        "switchport mode dynamic desirable",
        "switchport trunk allowed vlan 10,40"
      ],
      [
        0,
        1
      ],
      "Explanation: The edge port remains an access port and advertises the voice VLAN with switchport voice vlan 40. A voice VLAN is not configured by making the user port a trunk or changing its native VLAN."
    ],
    [
      "Three links should form one EtherChannel, but show etherchannel summary reports Po1(SU) and Gi0/1(P) Gi0/2(P) Gi0/3(I). What does I indicate for Gi0/3?",
      [
        "The interface is stand-alone and is not bundled in the port-channel",
        "The interface is a Layer 3 routed port-channel member",
        "The interface is the STP root port",
        "The interface is administratively shut down"
      ],
      [
        0
      ],
      "Explanation: In EtherChannel summary output, I indicates an individual, non-bundled port. P indicates a bundled port; SU indicates a Layer 2 port-channel in use."
    ],
    [
      "Two adjacent switch ports should form an LACP EtherChannel. One side is active and the other is passive. What is the expected result?",
      [
        "They cannot form because both ends must be active",
        "They can negotiate and form the channel",
        "They form only if both ends use PAgP auto",
        "They form but carry only untagged frames"
      ],
      [
        1
      ],
      "Explanation: LACP active initiates negotiation and can form with passive, which responds. Both passive would not initiate; PAgP modes and untagged-only behavior are irrelevant."
    ],
    [
      "Which two LACP mode pairings can successfully negotiate an EtherChannel? Choose two.",
      [
        "active with passive",
        "active with active",
        "passive with passive",
        "desirable with auto",
        "on with passive"
      ],
      [
        0,
        1
      ],
      "Explanation: LACP forms when at least one side is active; active-active and active-passive work. Passive-passive does not initiate, while desirable/auto are PAgP modes and on is static."
    ],
    [
      "Two switches are configured for PAgP, one desirable and the other auto. What should happen if member parameters match?",
      [
        "The links remain individual because auto never responds",
        "The links bundle only if both sides use desirable",
        "PAgP can negotiate the EtherChannel",
        "The links form only after configuring LACP active"
      ],
      [
        2
      ],
      "Explanation: PAgP desirable initiates negotiation and auto responds, so the channel can form. Auto-auto is passive on both sides; LACP is a different protocol."
    ],
    [
      "Both ends configure channel-group 7 mode on. Which statement is accurate?",
      [
        "LACP actively negotiates membership",
        "PAgP negotiates only when a member fails",
        "The channel cannot form because on is a passive mode",
        "The channel is statically forced without LACP or PAgP negotiation"
      ],
      [
        3
      ],
      "Explanation: mode on statically forces an EtherChannel without LACP/PAgP negotiation. Both ends must be configured consistently; on is not a negotiation mode."
    ],
    [
      "An EtherChannel member is suspended after being added. Which two checks are most relevant before changing the negotiation protocol? Choose two.",
      [
        "Verify matching speed and duplex settings across member ports",
        "Verify consistent trunk/access mode and VLAN settings across members",
        "Change one member to a different native VLAN",
        "Enable PortFast on the port-channel only",
        "Assign a different IP subnet to each physical member"
      ],
      [
        0,
        1
      ],
      "Explanation: Member interfaces need compatible Layer 2 settings and matching physical characteristics such as speed/duplex. Intentionally mismatching VLAN settings or assigning member IPs is incorrect."
    ],
    [
      "An EtherChannel should carry VLANs 10 and 20. LACP is active and physical parameters match, but the port-channel interface is configured as an access port. What should be changed?",
      [
        "Configure the port-channel as a trunk and set its allowed VLAN list",
        "Configure each member as a separate routed interface",
        "Set the port-channel native VLAN to both 10 and 20",
        "Disable LACP on the physical members"
      ],
      [
        0
      ],
      "Explanation: Configure trunking and allowed VLANs consistently on the logical Port-channel interface. A native VLAN is a single VLAN; disabling LACP or routing members would not meet the requirement."
    ],
    [
      "A switch shows Po2(SD) and member ports marked (s). What is the best interpretation?",
      [
        "The Layer 3 port-channel is up with all members bundled",
        "The Layer 2 port-channel is down and its member ports are suspended",
        "The port-channel is forwarding as the STP root port",
        "The port-channel uses static mode and is operational"
      ],
      [
        1
      ],
      "Explanation: In show etherchannel summary, S denotes Layer 2, D denotes down, and s marks suspended members. Layer 3 in-use uses R and U; bundled members show P."
    ],
    [
      "Which two interface settings should normally match across ports intended for the same Layer 2 EtherChannel? Choose two.",
      [
        "Trunking mode and allowed VLAN configuration",
        "Native VLAN configuration",
        "Different port-channel group numbers",
        "Different access VLANs on individual members",
        "Different Layer 3 IP addresses on member links"
      ],
      [
        0,
        1
      ],
      "Explanation: Channel members need consistent trunk and VLAN parameters, including native VLAN where applicable. Different group numbers split membership, and Layer 3 addresses are not assigned to Layer 2 member links."
    ],
    [
      "Two equal-cost paths connect a switch to the root bridge. How does the switch select its root port?",
      [
        "It always chooses the interface with the highest port number",
        "It chooses the port that received the most recent BPDU",
        "It chooses the lowest total root-path cost, then uses tie-breakers such as upstream bridge and port IDs",
        "It selects the link with the highest path cost"
      ],
      [
        2
      ],
      "Explanation: Root-port selection first uses the lowest root-path cost, then ordered tie-breakers including sender bridge ID and sender port ID, followed by local port ID as needed."
    ],
    [
      "In an STP election, the switch with the lower numerical bridge priority has a higher MAC address than its rival. Which switch becomes root?",
      [
        "The switch with the lower MAC address regardless of priority",
        "The switch that sends the first BPDU",
        "The switch with the higher bridge priority",
        "The switch with the lower bridge priority"
      ],
      [
        3
      ],
      "Explanation: Root election uses the lowest bridge ID, comparing priority before MAC address. A higher MAC address does not overcome a lower numerical priority."
    ],
    [
      "An engineer wants SW3 to become the root for VLAN 30 without changing other VLAN root elections. Which command is most direct?",
      [
        "spanning-tree vlan 30 root primary",
        "spanning-tree root primary",
        "spanning-tree vlan 30 portfast",
        "spanning-tree vlan 30 priority 61440"
      ],
      [
        0
      ],
      "Explanation: spanning-tree vlan 30 root primary adjusts SW3's priority for that VLAN to make it root when feasible. PortFast affects edge behavior, while a very high priority makes root election less likely."
    ],
    [
      "show spanning-tree vlan 20 reports Gi1/0/1 Root FWD, Gi1/0/2 Desg FWD, Gi1/0/3 Altn BLK. What is Gi1/0/3's role and state?",
      [
        "Designated port forwarding toward the root",
        "Alternate port in the blocking/discarding role-state",
        "Root port in the listening state",
        "Disabled port with no spanning-tree role"
      ],
      [
        1
      ],
      "Explanation: Altn identifies an alternate path toward the root, and BLK indicates it is not forwarding in classic output. It is neither a root/designated forwarding port nor administratively disabled."
    ],
    [
      "On a non-root switch, one port has the lowest-cost path toward the root bridge. What role should it normally have?",
      [
        "Designated port",
        "Backup port",
        "Root port",
        "Edge port"
      ],
      [
        2
      ],
      "Explanation: Each non-root bridge selects one root port as its best path toward the root. Designated is selected per segment; backup and edge describe other conditions."
    ],
    [
      "Two switches share a LAN segment. One advertises a superior path to the root. Which port on that segment is designated?",
      [
        "The port on the switch with the higher bridge ID",
        "The port with the larger interface number",
        "The port that is administratively down",
        "The port on the switch advertising the superior BPDU"
      ],
      [
        3
      ],
      "Explanation: The designated port is the segment's port advertising the best BPDU. A higher bridge ID and larger interface number lose relevant comparisons; a shutdown port cannot forward."
    ],
    [
      "A classic 802.1D switch port transitions from blocking toward forwarding on a shared LAN. Which sequence is correct?",
      [
        "Listening, then learning, then forwarding",
        "Learning, then blocking, then forwarding",
        "Discarding, then forwarding, then learning",
        "Forwarding, then listening, then learning"
      ],
      [
        0
      ],
      "Explanation: In classic STP, a port moves from blocking to listening, then learning, then forwarding, subject to forward-delay timers. RSTP uses discarding, learning, and forwarding states."
    ],
    [
      "RSTP show spanning-tree output shows a port in discarding. What does that mean?",
      [
        "The port is administratively shut down",
        "The port is not forwarding user traffic, though it may process BPDUs",
        "The port forwards frames but suppresses BPDUs",
        "The port is necessarily the root port"
      ],
      [
        1
      ],
      "Explanation: RSTP discarding prevents user-frame forwarding while retaining control-plane BPDU participation as applicable. Discarding neither means shutdown nor identifies a unique role."
    ],
    [
      "A user-facing port should enter forwarding immediately, but an unexpected switch may be connected. Which feature pair provides rapid edge forwarding and protection?",
      [
        "spanning-tree loopguard with spanning-tree bpdufilter enable",
        "switchport nonegotiate with spanning-tree rootguard",
        "spanning-tree portfast with spanning-tree bpduguard enable",
        "spanning-tree vlan 1 priority 0 with channel-group 1 mode on"
      ],
      [
        2
      ],
      "Explanation: PortFast accelerates an edge port to forwarding; BPDU Guard err-disables it if it receives a BPDU. BPDU filtering can hide BPDUs and is not the requested protection."
    ],
    [
      "A PortFast port receives a BPDU and enters err-disabled after BPDU Guard is enabled. What is the correct interpretation?",
      [
        "BPDU Guard elected a new root and disabled all trunks",
        "The port has negotiated a native VLAN mismatch",
        "The switch automatically converted the port into a routed interface",
        "A bridge-like device may be connected; investigate the topology before restoring the port"
      ],
      [
        3
      ],
      "Explanation: BPDU Guard protects the edge assumption by shutting down a PortFast port that receives a BPDU. Investigate the attached device and cabling before recovery; it does not elect a root."
    ],
    [
      "Which two statements about PortFast and BPDU Guard are correct? Choose two.",
      [
        "PortFast is intended for edge ports and can avoid usual STP delay before forwarding",
        "BPDU Guard can disable a protected port when a BPDU is received",
        "PortFast guarantees that the port can never participate in a loop",
        "BPDU Guard makes a trunk ignore all received BPDUs",
        "BPDU Guard elects the local switch root"
      ],
      [
        0,
        1
      ],
      "Explanation: PortFast expedites edge-port forwarding but is not loop immunity. BPDU Guard err-disables a protected interface on BPDU reception; it neither suppresses BPDUs nor elects a root."
    ],
    [
      "An engineer wants to prevent a downstream switch from becoming root through a designated access-facing port while still allowing BPDUs. Which feature is appropriate?",
      [
        "Root Guard",
        "BPDU Guard",
        "PortFast",
        "Loop Guard"
      ],
      [
        0
      ],
      "Explanation: Root Guard prevents superior BPDUs from changing root election through that port, placing it root-inconsistent if triggered. BPDU Guard shuts an edge port; Loop Guard protects against missing BPDUs."
    ],
    [
      "A redundant STP port begins forwarding after BPDUs stop arriving because of a unidirectional failure. Which feature is designed to prevent this failure mode?",
      [
        "BPDU Guard",
        "Loop Guard",
        "Root Guard",
        "DTP"
      ],
      [
        1
      ],
      "Explanation: Loop Guard detects loss of expected BPDUs on a non-designated port and keeps it from incorrectly transitioning to forwarding. BPDU Guard reacts to received BPDUs; Root Guard controls superior BPDUs."
    ],
    [
      "Read show spanning-tree vlan 10\nRoot ID  Priority 24586  Address 0011.2233.4455\nBridge ID Priority 32778  Address 00aa.bbcc.ddee\nInterface  Role  Sts  Cost  Prio.Nbr\nGi0/1      Root  FWD  4     128.1\nGi0/2      Desg  FWD  4     128.2\nGi0/3      Altn  BLK  4     128.3\nWhat does Root ID establish?",
      [
        "The local switch is root because its Bridge ID is listed",
        "Gi0/3 is the root port",
        "The identified bridge is elected root for VLAN 10",
        "The root is determined by interface cost only"
      ],
      [
        2
      ],
      "Explanation: Root ID identifies the elected root bridge for VLAN 10. Since the local Bridge ID differs and Gi0/1 is marked Root, this switch is not root; Gi0/3 is alternate."
    ],
    [
      "A Rapid PVST+ point-to-point link converges rapidly after a topology change. Which mechanism is fundamental to RSTP rapid transition?",
      [
        "Waiting for the full 802.1D maximum-age timer on every link",
        "Using DTP to announce the root bridge",
        "Disabling BPDU transmission on designated ports",
        "Proposal/agreement exchanges between neighboring bridges"
      ],
      [
        3
      ],
      "Explanation: RSTP proposal/agreement handshakes enable rapid transition on suitable point-to-point links. Waiting for classic timers defeats rapid convergence; DTP is unrelated."
    ],
    [
      "A campus WLAN needs centralized policy and RF management while APs tunnel client traffic to a controller. Which architecture best fits?",
      [
        "Controller-based lightweight AP architecture",
        "Autonomous APs configured independently",
        "Ad hoc wireless architecture",
        "Wireless mesh with no controller"
      ],
      [
        0
      ],
      "Explanation: Lightweight APs commonly use CAPWAP to communicate with a WLC, which centralizes configuration and management. Autonomous APs operate independently; the other options do not meet the centralized requirement."
    ],
    [
      "A remote office loses its WAN path to the controller, but local client switching should continue where supported. Which lightweight AP mode is designed for remote-site survivability?",
      [
        "Monitor",
        "FlexConnect",
        "Rogue detector",
        "Sniffer"
      ],
      [
        1
      ],
      "Explanation: FlexConnect supports remote-site operation and can locally switch client traffic; selected functions continue during controller loss when configured and supported. Monitor, rogue detector, and sniffer do not provide normal client access."
    ],
    [
      "An AP must scan for rogue devices and provide location information but not serve client associations. Which mode matches?",
      [
        "Local mode",
        "FlexConnect mode",
        "Monitor mode",
        "Bridge mode"
      ],
      [
        2
      ],
      "Explanation: Monitor mode dedicates the AP to scanning for rogues and related monitoring rather than serving clients. Local and FlexConnect can serve clients; bridge mode supports bridging links."
    ],
    [
      "A WLC-managed AP should act as a dedicated sensor for rogue APs and wireless threats without serving clients. Which mode fits?",
      [
        "Local",
        "FlexConnect",
        "Workgroup bridge",
        "Monitor"
      ],
      [
        3
      ],
      "Explanation: Monitor mode dedicates radios to scanning and security monitoring rather than client service. Local and FlexConnect are client-serving modes."
    ],
    [
      "A lightweight AP connects to a WLC through a routed network. Which protocol normally carries AP-controller control and data communication?",
      [
        "CAPWAP",
        "DTP",
        "LACP",
        "VTP"
      ],
      [
        0
      ],
      "Explanation: CAPWAP carries control and, depending on deployment/configuration, wireless data between lightweight APs and controllers. The other protocols handle trunk negotiation, link aggregation, or VLAN database propagation."
    ],
    [
      "A WLC dynamic interface is configured for VLAN 60, but its connected switchport does not carry VLAN 60. Clients join but cannot reach the intended wired subnet. What should be corrected?",
      [
        "Set the AP to monitor mode",
        "Ensure the controller uplink carries VLAN 60 and the dynamic interface maps to its correct VLAN/subnet",
        "Set the controller management interface to VLAN 60 without changing the uplink",
        "Change the WLAN SSID to the VLAN number"
      ],
      [
        1
      ],
      "Explanation: The dynamic interface must map to the correct VLAN/subnet, and the controller's wired connection must transport it. AP mode or SSID naming does not fix a missing VLAN path."
    ],
    [
      "A WLAN is broadcast with the right SSID, but authenticated users receive no address. The controller's mapped dynamic interface has a wrong DHCP server address. What is the most direct fix?",
      [
        "Change the SSID to hidden",
        "Enable DTP desirable on the AP radio",
        "Correct the DHCP server or relay information associated with the mapped interface",
        "Change the WLC country code"
      ],
      [
        2
      ],
      "Explanation: Incorrect DHCP server/relay information on the WLAN's mapped interface can prevent client leases. SSID visibility, DTP, and country code do not correct the DHCP destination."
    ],
    [
      "A WLC-managed SSID should authenticate users against an enterprise identity service rather than a shared passphrase. Which approach is appropriate?",
      [
        "WPA2-Personal with one shared pre-shared key",
        "Open authentication with MAC filtering only",
        "WEP with shared-key authentication",
        "WPA2/WPA3-Enterprise using 802.1X and a RADIUS server"
      ],
      [
        3
      ],
      "Explanation: Enterprise WLAN security uses 802.1X with an authentication server such as RADIUS. A shared PSK is personal mode; open/MAC filtering and WEP are weaker alternatives."
    ],
    [
      "A small WLAN has no RADIUS service and uses one passphrase shared among household devices. Which mode describes it?",
      [
        "WPA2-Personal or WPA3-Personal using a pre-shared key",
        "WPA2-Enterprise using 802.1X",
        "Open authentication with EAP-TLS",
        "WEP Enterprise with RADIUS"
      ],
      [
        0
      ],
      "Explanation: Personal mode uses a pre-shared key and does not require RADIUS-backed 802.1X. Enterprise depends on 802.1X; the other pairings are inconsistent or obsolete."
    ],
    [
      "Which two capabilities are associated with WPA3-Personal compared with legacy WPA2-Personal deployments? Choose two.",
      [
        "SAE is used for password-based authentication",
        "Protected Management Frames are required for WPA3 certification",
        "WEP provides forward secrecy for WPA3 clients",
        "WPA3-Personal requires a RADIUS server",
        "TKIP is mandatory for WPA3-Personal"
      ],
      [
        0,
        1
      ],
      "Explanation: WPA3-Personal uses SAE and requires Protected Management Frames. It does not require RADIUS, and WEP/TKIP are not its security basis."
    ],
    [
      "A WPA2-Enterprise client cannot join. The AP is reachable and SSID is correct, but RADIUS logs reject the user's credentials. Which layer should be investigated first?",
      [
        "The access switch native VLAN for the AP uplink",
        "The user credentials and RADIUS policy/identity store",
        "The AP's DTP negotiation mode",
        "The STP root port on the client"
      ],
      [
        1
      ],
      "Explanation: A RADIUS rejection points first to credentials, account state, or AAA policy. Transport matters if the server is unreachable, but the stated rejection confirms that the request arrived and was denied."
    ],
    [
      "An administrator wants to see which access ports are assigned to VLAN 120 and whether the VLAN is active. Which command is the best first check?",
      [
        "show etherchannel summary",
        "show spanning-tree",
        "show vlan brief",
        "show lldp neighbors"
      ],
      [
        2
      ],
      "Explanation: show vlan brief displays VLAN status and access-port membership. EtherChannel, spanning-tree, and LLDP commands answer different questions."
    ],
    [
      "Read show vlan brief\nVLAN Name                             Status    Ports\n1    default                          active    Gi0/1, Gi0/2\n20   engineering                      active    Gi0/3\n40   voice                            active    Gi0/4\n99   management                       active\nA user on Gi0/2 should be in VLAN 20. What follows from the output?",
      [
        "VLAN 20 is missing from the switch",
        "Gi0/2 is an 802.1Q trunk carrying all VLANs",
        "Gi0/2 is blocked by STP in VLAN 20",
        "Gi0/2 is assigned to VLAN 1, so its access VLAN needs correction"
      ],
      [
        3
      ],
      "Explanation: show vlan brief lists Gi0/2 under VLAN 1, not VLAN 20. The output does not identify a trunk or STP state; VLAN 20 exists and is active."
    ],
    [
      "Read show interfaces trunk\nPort      Mode   Encapsulation  Status    Native vlan\nGi0/24    on     802.1q         trunking  1\nPort      Vlans allowed on trunk\nGi0/24    10,20,30\nPort      Vlans allowed and active in management domain\nGi0/24    10,20,30\nPort      Vlans in spanning tree forwarding state and not pruned\nGi0/24    10,30\nVLAN 20 is permitted and active but absent from the last section. Why is it not forwarding?",
      [
        "Spanning tree is not forwarding VLAN 20 on this link, or it is pruned",
        "VLAN 20 is not allowed by the trunk",
        "VLAN 20 is configured as the native VLAN",
        "The physical link has no 802.1Q encapsulation"
      ],
      [
        0
      ],
      "Explanation: VLAN 20 appears as allowed and active but not among VLANs in spanning-tree forwarding state and not pruned. This points to STP non-forwarding or pruning, not allowed-list or encapsulation failure."
    ],
    [
      "A show spanning-tree excerpt lists Root ID Priority 24586 Address 0011.2233.4455 and Bridge ID Priority 32778 Address 00aa.bbcc.ddee. What is correct?",
      [
        "This switch is root because its Bridge ID appears after Root ID",
        "This switch is not the root bridge for the displayed spanning-tree instance",
        "Priority 32778 is lower than 24586",
        "The MAC address alone proves this switch is root"
      ],
      [
        1
      ],
      "Explanation: Local Bridge ID and Root ID differ, so the local switch is not root for that instance. The root priority is numerically lower; output order does not imply root status."
    ],
    [
      "A show etherchannel summary excerpt is Po4(RU) LACP Gi0/1(P) Gi0/2(P). Which interpretation is correct?",
      [
        "Po4 is a Layer 2 channel that is down",
        "Gi0/1 and Gi0/2 are individual ports, not members",
        "Po4 is a Layer 3 port-channel in use, and both interfaces are bundled",
        "Po4 is suspended because LACP is passive"
      ],
      [
        2
      ],
      "Explanation: R means Layer 3, U means in use, and P marks bundled members. A Layer 2 port-channel uses S; individual and suspended members use other flags."
    ],
    [
      "Both ends of an intended LACP bundle are passive, so no channel forms. What is the most direct correction?",
      [
        "Change both ends to LACP passive again",
        "Change both ends to PAgP auto",
        "Enable spanning-tree PortFast on the links",
        "Change at least one end to LACP active"
      ],
      [
        3
      ],
      "Explanation: Passive LACP responds but does not initiate; at least one side must be active. PAgP is a different protocol and PortFast does not negotiate EtherChannel."
    ],
    [
      "A port-channel is up, but one member is not bundled after a change. Its allowed VLAN list differs from the logical port-channel. What should be done?",
      [
        "Make member and port-channel Layer 2 settings consistent",
        "Assign the member a unique IP address",
        "Change only the remote native VLAN",
        "Enable BPDU Guard on the port-channel"
      ],
      [
        0
      ],
      "Explanation: EtherChannel members need consistent channel-relevant settings, best applied on the logical Port-channel. A mismatched allowed list can prevent bundling; IP and BPDU Guard are not the fix."
    ],
    [
      "A client on a WLAN gets a network-key prompt and no username, though the intended design is WPA2-Enterprise. Which setting is most likely inconsistent?",
      [
        "The WLAN is mapped to a dynamic interface",
        "The WLAN uses personal/PSK authentication instead of 802.1X enterprise authentication",
        "The AP is in local mode",
        "The 5-GHz radio is enabled"
      ],
      [
        1
      ],
      "Explanation: A PSK prompt is consistent with personal mode, whereas enterprise security uses 802.1X credentials and an authentication service. Interface mapping, AP mode, and band do not determine PSK versus enterprise authentication."
    ],
    [
      "An AP uplink must carry corporate client VLANs 100 and 110, while AP management uses VLAN 20. Which principle is correct?",
      [
        "Configure the uplink as access VLAN 100 and assume VLAN 110 is carried",
        "Set native VLAN 20 and omit all client VLANs",
        "Carry required management and client VLANs as appropriate to the AP/WLC design and verify tagging expectations",
        "Use DTP to assign a different native VLAN to each SSID"
      ],
      [
        2
      ],
      "Explanation: AP uplink tagging depends on AP mode and wireless architecture; the switch must carry required management and client VLANs. An access link cannot carry multiple tagged VLANs, and DTP does not map SSIDs."
    ],
    [
      "A controller-based deployment needs an AP to bridge a wireless client segment to a wired remote LAN over wireless backhaul. Which mode is associated with that function?",
      [
        "Monitor mode",
        "Sniffer mode",
        "Rogue detector mode",
        "Bridge mode"
      ],
      [
        3
      ],
      "Explanation: Bridge mode supports wireless bridging between LAN segments. Monitor, sniffer, and rogue detector modes observe wireless activity rather than bridge user traffic."
    ],
    [
      "A client associates and authenticates, but its traffic lands in the wrong wired VLAN. Which WLC setting should be checked first?",
      [
        "The WLAN-to-interface or policy/profile VLAN mapping",
        "The AP monitor-mode channel scan list",
        "The switch CDP timer",
        "The core EtherChannel protocol"
      ],
      [
        0
      ],
      "Explanation: WLC WLAN/profile mapping determines the interface or policy/VLAN used for client traffic. Channel scanning, CDP timers, and EtherChannel negotiation do not choose the client VLAN."
    ],
    [
      "Which control creates a separate Layer 2 broadcast domain for a guest WLAN before access policies are applied?",
      [
        "Apply an access policy or ACL restricting guest access to internal networks",
        "Map the guest WLAN to a dedicated guest VLAN/interface",
        "Place the guest WLAN in the unrestricted corporate VLAN",
        "Disable all DHCP services for the guest WLAN",
        "Set the guest SSID as the native VLAN"
      ],
      [
        1
      ],
      "Explanation: Mapping the guest WLAN to a dedicated guest VLAN/interface creates Layer 2 separation. An ACL can further restrict traffic but does not itself create a separate broadcast domain."
    ],
    [
      "A WLC uplink is a trunk, but the controller expects untagged management traffic for its native VLAN. Management frames arrive in the wrong subnet. Which setting is a likely cause?",
      [
        "The LACP system ID is lower on the controller",
        "The AP is configured for BPDU Guard",
        "The switch trunk native VLAN and WLC management tagging expectations disagree",
        "The controller uses WPA3 instead of WPA2"
      ],
      [
        2
      ],
      "Explanation: Untagged management frames are classified into the trunk's native VLAN, so native/tagging expectations must align. LACP, BPDU protection, and WLAN encryption do not classify management frames."
    ],
    [
      "A WLAN uses WPA3-Enterprise and certificate-based identity. Which authentication framework should the client and AAA infrastructure use?",
      [
        "A shared PSK with SAE only",
        "WEP shared-key challenge",
        "DTP negotiation with the AP",
        "802.1X/EAP with a RADIUS-backed authentication service"
      ],
      [
        3
      ],
      "Explanation: WPA3-Enterprise relies on 802.1X/EAP and typically a RADIUS AAA server; certificate methods include EAP-TLS. SAE is personal mode, and WEP/DTP are inappropriate."
    ],
    [
      "A WLC shows an AP disconnected. It has power and Ethernet link but cannot reach the controller management address. Which two checks are most useful? Choose two.",
      [
        "Verify IP addressing, default gateway, and routed reachability from the AP management network",
        "Verify CAPWAP control traffic is permitted between AP and controller",
        "Change the client SSID WPA passphrase",
        "Enable PortFast on every routed interface",
        "Change the VLAN name to match the controller name"
      ],
      [
        0,
        1
      ],
      "Explanation: AP discovery/join requires IP reachability and permitted CAPWAP connectivity. Client credentials, VLAN naming, and PortFast on routed interfaces do not restore the AP-controller path."
    ],
    {
      "type": "dnd",
      "question": "Match each IOS command to the setting it configures.",
      "pairs": [
        [
          "switchport access vlan 25",
          "Access VLAN membership"
        ],
        [
          "switchport trunk native vlan 99",
          "Untagged VLAN on an 802.1Q trunk"
        ],
        [
          "switchport trunk allowed vlan 10,20",
          "VLANs permitted on a trunk"
        ],
        [
          "switchport mode trunk",
          "Static trunk mode"
        ]
      ],
      "explanation": "Explanation: Access VLAN assigns an endpoint port; native VLAN classifies untagged trunk frames; allowed vlan filters trunk VLANs; mode trunk statically enables trunking."
    },
    {
      "type": "dnd",
      "question": "Match each show command to the primary information it provides.",
      "pairs": [
        [
          "show vlan brief",
          "VLAN status and access-port membership"
        ],
        [
          "show interfaces trunk",
          "Trunk state, native VLAN, and VLAN forwarding lists"
        ],
        [
          "show spanning-tree vlan 10",
          "Root bridge, port roles, and states for VLAN 10"
        ],
        [
          "show etherchannel summary",
          "Port-channel protocol and member bundling flags"
        ]
      ],
      "explanation": "Explanation: These commands respectively verify VLAN membership, trunk status, per-VLAN STP, and EtherChannel operation."
    },
    {
      "type": "dnd",
      "question": "Match each EtherChannel mode to its protocol or behavior.",
      "pairs": [
        [
          "LACP active",
          "Initiates LACP negotiation"
        ],
        [
          "LACP passive",
          "Responds to LACP but does not initiate"
        ],
        [
          "PAgP desirable",
          "Initiates PAgP negotiation"
        ],
        [
          "PAgP auto",
          "Responds to PAgP but does not initiate"
        ],
        [
          "mode on",
          "Forces static bundling without negotiation"
        ]
      ],
      "explanation": "Explanation: Active/desirable initiate their respective protocols, while passive/auto respond. On forms a static bundle without LACP or PAgP negotiation."
    },
    {
      "type": "dnd",
      "question": "Match each STP term to its role or behavior.",
      "pairs": [
        [
          "Root port",
          "Best path from a non-root bridge toward the root"
        ],
        [
          "Designated port",
          "Forwarding port selected for a LAN segment"
        ],
        [
          "Alternate port",
          "Backup path toward the root in RSTP"
        ],
        [
          "BPDU Guard",
          "Disables a protected edge port on BPDU receipt"
        ]
      ],
      "explanation": "Explanation: Root and designated ports provide selected active paths; an alternate provides a redundant path, and BPDU Guard protects an edge port from unexpected bridge BPDUs."
    },
    {
      "type": "dnd",
      "question": "Match each wireless AP mode to its primary purpose.",
      "pairs": [
        [
          "Local",
          "Client service with normal controller-managed operation"
        ],
        [
          "FlexConnect",
          "Remote-site operation with optional local switching"
        ],
        [
          "Monitor",
          "Dedicated wireless scanning without client service"
        ],
        [
          "Sniffer",
          "Captures wireless frames for protocol analysis"
        ],
        [
          "Bridge",
          "Connects LAN segments over a wireless link"
        ]
      ],
      "explanation": "Explanation: These modes distinguish client service, remote-site operation, scanning, packet capture, and wireless bridging."
    },
    {
      "type": "dnd",
      "question": "Match each WLAN security method or feature to its description.",
      "pairs": [
        [
          "WPA2-Personal",
          "Shared pre-shared key authentication"
        ],
        [
          "WPA2-Enterprise",
          "802.1X authentication typically backed by RADIUS"
        ],
        [
          "WPA3-Personal",
          "Password-based SAE authentication"
        ],
        [
          "Protected Management Frames",
          "Protects selected robust management frames"
        ],
        [
          "WEP",
          "Legacy wireless encryption unsuitable for secure deployment"
        ]
      ],
      "explanation": "Explanation: Personal modes use password-based credentials, Enterprise uses 802.1X and AAA, WPA3-Personal uses SAE, PMF protects management frames, and WEP is obsolete."
    },
    [
      "A switch should advertise LLDP and listen for LLDP on Gi0/8. Which interface configuration enables both directions?",
      [
        "interface Gi0/8; lldp transmit; lldp receive",
        "interface Gi0/8; no lldp transmit; no lldp receive",
        "lldp run; switchport mode trunk",
        "cdp run; lldp receive"
      ],
      [
        0
      ],
      "Explanation: LLDP transmit and receive are enabled per interface with lldp transmit and lldp receive. no lldp commands disable them; global LLDP and CDP commands do not substitute for both interface settings."
    ]
  ]
});
