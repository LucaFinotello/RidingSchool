<?php

require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/PDFShift.php");
require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/Exceptions/PDFShiftException.php");
require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/Exceptions/InvalidRequestException.php");
require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/Exceptions/NoCreditsException.php");
require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/Exceptions/RateLimitException.php");
require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/Exceptions/ServerException.php");
require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/Exceptions/InvalidApiKeyException.php");

use \PDFShift\PDFShift;
PDFShift::setApiKey($pdfshift_api_key);

function toPdf($template = null, $options = null, $pdfpostdata = null) {
	global $fl_prod;
	global $url;
	global $user;

	$response = (Object) [
		"status" => false
		,"response" => "init"
	];

	$options = isset($options) && $options ? $options : (Object) [];
	@$options->sandbox = $fl_prod != 3;
	@$options->sandbox = true; //forzo la sandbox. ho una licenza free

	if (isset($url) && $url) {
		if ($template) {
			$temp_path = "/../../file/temp/pdfshift";
			$temp_filename = $user->username . "_" . date("U") . ".html";
			$temp_dest = __DIR__ . "/$temp_path/$temp_filename";

			if (file_put_contents($temp_dest, str_replace(
				"[TEMPLATE]"
				,isset($template) ? "../../../ubprint/tmpl/$template" : "undefined"
				,str_replace(
					"[POSTDATA]"
					,json_encode(isset($pdfpostdata) ? $pdfpostdata : null)
					,file_get_contents(__DIR__ . "/../../ubprint/ubprint.html")
				)
			))) {
				try {
					if ($fl_prod != 0) {
						$response->response = str_replace( //con questo dovrei teoricamente togliere l'immagine della sandbox
							'Gb"0PJI0+7&-+HZ?i$=e:s2Fo.5Cu*zzzzzz!!!"<ecGgONq%8m!9j#t!!)6SFoVO+o6(*6kjrrt!9j#t!!)6SFoVO+o6(*6kjrrt!9j#t!!)6SFoVO+o6(*6kjrrt!9j#t!!)6SFoVNPQa[%s5bGLf!\'m0c!rtTY[fZUqT=4n&5bGLf!\'m0c!rtTY[fZUqT=4n&5bGLf!\'m0c!rtTY[fZUqa4$Z-3rf8.ceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T[2?n!2.Zm!<Ae=gAq;IceAI#T^T"l!rr<$zzzz!!!#sbm\'g_eB%~>'
							,""
							,str_replace( //con questo dovrei teoricamente togliere l'immagine della sandbox
								'Gb"/lk<e`3&3rSt\'e:\'l6UeqJLnZ(A/ar^=(Nn8mR4ZOHi19JkR"Q_4fePYLGm$DE"@3S%5nF/b&-P91"@3S%5nF/b&-P91"@8EOE;D?]hekAXT*IXn`n5b7^UV@q4r&YlbYXl+hfK7/:PKtt\'BEKu?i!4CVaD#K!VZI7K<jh7+UCD!f-/K=iMu2W+p^Ls%q3f_pT!O8+p^Lo]nkkNAD?c+&HneqMl>h<CsVc7&HneoXdJ;Nr5eP&&Hneo=MoR\'WU#`l#XU$lDh.%gf4RM`KN9Qi5kJ9<JL-+:7Hk[$rLRJ+$0"`XN)$*s5V]Ld7BTg4h*/Q5-I_3i14"DZ3NmAL/L5r/mf:`?/+u_G]</sG=ei^-G]p-nqee<Pp,:?Ss6_?7,+*N+KB9P1r>BP^rF+l6:%?/S[piG/J%sYGlpD>EE>[>MPJ??Z\uSu^]u+1i?7,R1Y(2:<A1n.q!Bm4[B)U;Pr!."AET_tdZWd:KOJeZ-(IaGpACtRVH$^F:[o?*bGUo3hIeX/m^ci\79lC*&f(keYdp:4UmN):in1qQ4*\'!o%[F>j]4TAf4Ijh;-U?>mr?LK7YqV(L&G6!W*6l7fC><h2Z3XII\'\'-Pi&3t;cRalGeR),B8gJpHf5Om85phhNOOTV\'Vom0&O6l6O#9DE+$(J&$HhcEU;m^,X4bM=,I`cPOed$!qgV4C<S;fNUkK)b-F"POL=f@M]m(R3,WnF=PTQhfSBkVXSuLTWT2/@)MR?3;/(^^Q=j6--t+mc?AU9lK5\6DD`BRqqLG)b3Q8<NTZhb3-%X;IK)TT+k(`)qa3g$c$Nd0=5Mn,@K;r]=!rI"jljGAU]+!ZE$I#c&IhUm4?Nk(F=o-b4LOAO]3nM`XlkU\\l.kM\E>Ap,eIk#+#NOnS_0N8hiTMR_n4A<=()OgH`[P>`"mI=^P($^ma#Y\',Gb\']E?Q$"?`#tnOW8n0ngk]e,gY"tmPlkE#JXO3VjXkc_V2adBH^$)HfMs1)EdcWgs;T&ci*BboIhudGmVuJpA3.L\`rf/LNq/D>qfDRSuWO\nZhjrk"k0kB!%!gf-@9P@D%Z(_fL=Q$bb!J\aSFsLAdV74;T)QTA1KirP">6/)-%fpuVo%53078d2huCrpB)nbPZCcio.TCE:).s.mo6Xrg5K_Urd]X75@E\XQQ_LVN6(#kA%C*4`UCScZ48Z=B$WM<.V[[^VJehr*;g:4I*Y"D_9MLA0pdOnrcZ$J^ioRgjd1JO1IIJa+==VL/H8U,9&i*Ofam\I,sCCGN-g)\V8gNot]O(eG`J40)+\/`kU(W\,jtW(P^5r)bloF*_^FBMqYiQURj](2Og=Z>CZJ/87.t?llj])8DuRA:`Em!19b:?\$$E4`OO?G*[,WN5"AgCqE,S$HPn.n57DBT:=,JK9S01gT-#?))(@\_<P?lQ>NrPPEo`9f`CGntH6>tLkPdVf"HB#MF,;Q]8^Bc12A;L-7(Mpd%t`G"nskiZo4Ym2L9AP5$&\'&O*#ae#.0+4Vqq/q]Vs"%Q][G9%kM`$WeViq0KC;UIW+e_m1K&Jc>pd,<>tm\,\RWU-_[h/Y-\.u<o,_oTXe,FMp`rQ:K:[j%L!nA+X\'_uZ8\'t!?H-St@GqN"?9TJqVN\L6\KFq1t5LnP7L]_t;#I8j7lLF!gOI%0TGpBclK6j;<gD@U8?USD"OQTR;(SSWg4Vo)+*QuK"(-XKu%tug8j>eHEkFPb=S3r?"+X^tOe2Nu;7mX@UM$`eoh`P8`f5Mj(HpH$*/lCa"9&TQRi"n\N:W+&9Jl(X6V=9QAN^"+7%EWZ\3mTsm<8HEfY3dl+*1%[PJ79A\'<>;]J6@#7M)-a&@W9F&/N>LYthr*nP4SM$[Y$H&9NF6>33R:(E8uYIMlUZ-[a`BpTcQfN-f.VBL8:FB<71nKLB"iZBD*``9<jKZCHg^"#<u4!uXR,b7;Nl1X`r$UV3R<=`^QFgFL*4e[RQ^[[AZsVho!sFGXM\TGY!?]j_gB*^h(#qYqO53@W!)0/9lT,<T(C]&r-NA-o3_gi:<O\GOQR#sSpsShBa`Luh\'In65N52fc5mm2NPC(_/FJ?WpY\e-4Q;sVo0rZZO#Pul>at=IGX;Vo\'ZkEN1!`\'d4lMEfNKs+CX[%"AJ"OBC^$c,,:91ZGo=R2:rbV]H=XNgs.s.Har8<G+Drs.mL-RT\'lnJWgc7nPZK%2[6"PAuCd!Lc$_jklDIs4qE^0<P)WiRN<*)&g2/O8r+G`Ef`kD-"\'o/uegU[P`R9RFK]]7]k.#7<i"Gtt`dkTnde=GHt>9Wqdu-)\'KPi%G21!E472SKaEiRI`Z*4:_pfG-pTj"F8:si;)@=^&Zo`+&&LIM,s*[rk2M!;nWJXc!hF[KV!PK%m5HP9]LDG\Mo-S=CBGGi#\'bOQ9BsFcP]bGkJj6\'bI-/Mco-5-B"eI\F9ZkB6rM@Ip\'USD9\'&&gieO_+1$Ns3cq::5Oqct;_ij2@<qcnIC0tR&r=j&Ea%CCm!aEr$>fg?9H4D:]C-l.%o=P@DF6E=HYVUchL@ZdJ4D.dfI.9pL,\'.43_?FHRBJTL<a4S-nP$*T`\'qKq0nUCejs+-<9kre]TnAW>X2O<@]oOn"DcP[K]pUkP93WtfV@V3bRfDIKi7LT_R^KZM:%?c"_OjjDV"t!"5mJ^\';NKlWe3Q%l[Mqa*lEcY/D<8i#_%*1+*21:8R.O\'A9[G?9AD4/uH<O`iu?79ldkJBO5e"fFT&]f$JA^A%p")bbYj-/4Tpcj)?b]4",Bn*Bo%4\@?@-FYBEB"J%*Ip>mjuiC49tYPLGm)61L2G7"Y6&?YlX;NI8)Ui]%Z^k/LmDLUK-^+0>i_r8?L<AFn/e5ImKPi3M!c)CN$X6AB@uquX,QiULV#L=D>bNg+=5n5lro9h%?f*0\')4cq=7E*\g]IY7Vc]_:T]a,Fm:f@#j<AlpE8e@:$BD.rJVJCZ>[fS.ZN%n4$J&ZlK-^(/%TLmtpW<KVr6S`:oR%&!pZP<"_F!g`iP]d_K_6p_d4#SY],73/T;\'eQp0q<[,kJYS`YZF_f^taO^bur$r\WkbXG?eo@mcWk:\'1!ViPorbgOis6UX_X;@,r*$.TkbqG[gG<+=-OuT\'L\&[nZ<Ogi1<^Va@!$]1V!;AgK!-ntimZ[Q-gK1L,4n<M15<E\'R&.)R5e%,$6A30(.M:I3jh?Sg-g9_.bbIStA9[^f\'-+aS3i&Q8e;t<oZq<<=>B\B/oK&?4&h\'$p,2t`U!!j8;b2$%Cq?_-:m-A\'D`dm$i/B33OfH5-&GdN]c&j*d%J(AGcm#gB=RQgo?MlUqAY8$VM]U29SV_Z0&K(sU\'OoO4g/62?f0gsWs6lXTNd4KL->9S"Z8;Q%k#K)E<gF$X\'/$RLL;_:1S.r4<)K5<G3M"(!V9UcWs!")l3Lb`3ECR/X()hk+f_-;?_S!2Ui:khcTN[N-5I2+g2h1<S;r)DZ)ukef2j`fMlbDm=+7`OHL>VMWF<P0#;q8uWtFp1e)le[:tH9:_c6`:DV$OeC%RLjQk%HYW#VU7ADD70,ZCg`I(c;R3dK"ilT(?jksKP`F(aNJWp"f>i6c^2SqCJq@iFJmpUiYgC3f8"V,oX%c>`,132SmsK/B37?K,?&I1I.fPBD*[\r/*Z[,F$ZDE5Rd_>l*3c>`0]QNr!/*9aLnkLMGJ[YG78]:d&_0Hh_4E*DdZd>C"Uo8A;>*6A+Mnsn[oF"`;"8e:NjWQ_@OF?NlMFGs@Xk=oV388s/,cPPL2@mSOm`f"Bd0(POkhK,ZoBP=6(MC*F.>^0Df5O8,sbtFJ9>(0!,M\'1+^=n!E$8.RGZ^4n`ZRNAVEHu)r@k@!"F\*\?.DYI>/7,M*YO5r;G\':tsZ`>MJFf8umrcbm`&qYMY\iI^,KRs5k?Dqa2B2Y*B#%F;_;]H=OlRd57/k.Kp^*M.n_2\'\'uC`@0>"Jel#/OB1jO9Ld,0NX_07.04LbIBdUWC[let*E(JI3V^9UJq]b?^*$K?IGiXmIh[aR*:`EUW[c-ls&nk3(ObO)fAS_sF"Nu9hb\']Ji6(X%$FNM\7/)n:T]s01T)\>\'/7B+;*TVE;97"o3JnZG=Sl`]04\'KZK@dOlqXU@Iha`Bpp4GQ?A[`gKtC<rM@h(K5/K8H?CX\4o[X0Kp!,Eh5K%!c00MAb0NUnWX/T$NkBEF]NMK:/91nk;a9PrT["hUh([5[`r7gJoQG);4Pm!9SWO\;WO)kreE,/C`&)3S<LpaW%\'.5F_eOZZok/[h(0;cH(t-YiamQ1J:%Acf_c8[\id]Q8\]*J&p2DnU+dAAMcWkK\\\'*EcP]mU*7K9Q78N:G5W50QHI\'F]00WF`1-;(ShI^kl\':,Hf"7htE&^QACeq5WA:@prG^Y^p0Qg1C?]DsPmS%5KHTM4l!Hm6n,D96ig2EV4C55m`p9-u^`q\'/50HZOI=hc<sZPM1)&&eeOURjlZn9:7flN]^rb_XeC<7J.UDWEU$u[(_tkBg\'e[OXDdH-mg)ZSk\BYqBjN+=n$f-\E6m)*gSOdml?cJh+:o5A?:K:@6)XcH-XK]kH!TITDk?^SKVcZhX`Lm[Uk!g6e4@1%jO9sgQCY-pR\Q]X>T^BePJk)jul5?`T&c%RI`O?G\;nP8"MN,HbKZ2>6`GqjeaA6\'!gpcZBAUUO(W%Lo5I`FHjKq$c>`1H5-XBm:]ciOga92<A!r:&^4iZ\]Z:$uH_-"u=Q1t^nsn[ko*/%iB;%>UeYjk\'F=gi]3NG6C`fbJjf<F<FS>?AAo/sAg#7ip>cP]J@cU#n\'Vrk5I"0oR)FdF\'pNm+lnX&q@b?FWT#4PuG$jlAG>V<;63o9U*e/!OCG:b?g(lR8crh"+5s\'b`5i+a]f9XoSIt-dNY?4^Wo?blcX/T]D1j,Z3MZ_7I]\'Xr^8k4g1V`QoL:.=nFiK4ial0PNN?uT\'nq.\=r7D?kuj^P0_KsMmI_GRJ"5:.9=N,.:pis@,fNnr^`.6$tl0(6M7f4fjg&YD)f)],Dk>!c+.K:o@u\'uWY,9f)teRp.K7QQ3cHE5Ho(>`iQ1Ug%slm>d@%=.8G%+R=\CSSY+%HG9R<;66g8oGY%`aicR(fY9K7`=:kA`ES-_LPSDhKZ/TB)2-Jna%62encRTM#IL`P-EGr"UZqDl=UYi&)/kkXD1PUk;=ZkY]e1OM:TSDh?Vgc>"pL-NCK\D3etO,U;d@U"!rjH7ZRkG>j"d6]!-?dq"=4o\F?:,)r&FJCi0s5Z2XJ`g$X\'e7Y"?3`\_;`KU>:tETO?>)j#2sV\'9)U6i-?XiiHZcFnCSq"f=4t4H4KX+oY3+l$Y1TYqp3s2C(B\'@B9ACYE*qP9IN@!V&q(`dmnR!3!6OYP0@Ip.$a]K/t\'_X#OO3Eq[0%,7@l_&m`)<(dfu*B-+^3d"8i[\6(j<NRg?k>No^gb5Ne0*`G3D<WZR3%$R:gCSYUYj6QpGTd-I\>dmHfC48!J<p?P0)MeROXMg)jnW.*/!hF*F5](Q:bk7;33M7p[jcUJYj$GIJP=ucnn3)-mfXW?oDMG^;[oQqRFnY8YZ.2ejlA2XGqA4HSOCpW\gW.L+\A7]m!52\'A**24`Nq$Oj:*h^a\'K@#i1477#\'QCsT1XN!%=\'"5I*Ji`VQWI8ER3EqLHK3Oo6_Vfdu[3/[>%Bb9j1ECTfI=tH)HtLF3-%oWW)].Yi"k$a4t,[H?8m4S&fZ**RF=IBJA#,jLVY6*O^`;4#3N?cFJ#>oB9b24I;V`1,du!(2/)2D8</QgT`gjLm]R8))aT12:9C)IS\HNrrq_a0>?#.nB1m\'F)UCD=XZr\'H!<0f`SCCe)6i9-j3GE!nB%g![=N7MB]bpLB:/F@Vh;.+o]JhRfaU\cfYMP]*i9!UBe9O48N_KdT<U9k%sNgo*M\DEMrn`Kft=tEK"i"<U7$N%S71(AobKI\p3@lOBd4f939r\'m=ngkKj^*6;[^`d\"1oPE?RZ*bRU!m2Pt:5#0O>R_S31F$oK9V5inqUgooRZj]EbZKg8TRGeY>RC5-Ye(]*t;*`PF80N35f*o%r4chLq>]kMMZtI/Wi#ZeG6H/h$oar_eb/4cT#[^ADVc*ZDL,=NMJJIEu77T.Im*-MI4ml*)6QOmJ8oB,L-N;JZ!9TA?]\'-2k:C5O"dKY)YCI3G?iQA0V::l^g<hQ`Dp5:SuK.a&l3AA-NXfF,!01$YqhZc.f.qbY<CX;$%I?SrGGh5n/^VKc&H9HTl>*>IuW6kD`YFCqL;?>(blr,GjSh-W`5ch<mX[n:m!n`W2?u.\'P/!YKFaL$uC)M+5bW^\'t^]4+)^ILrgQ)8Oo-*X3?sgP.nH?d!Oo%0MWXnp)t+Wm"Q)!mZK_2WZ+6:pokGibAGK2Bk^@\"4`Nf[1X^N^-<C4&_P?+$)GHhReN\TJlSq(hXEcuOhRDh$1efB6q-H!47&j%#<>oE/3?s7@H!XrGN2K(=lk&8Oos\'u>PbsZX:i-2G4i.PJ"Fu!prLFB,GrE*^IDZqNd^/eRK+5TASm0raYH-T`8G[bf%.$>8]!E@.<7#H_"ZEbB34p:lS>(U3:\'YR#Io*jMp.a`2%4!\pH)GY-5C!3ROj?PrcG`Y\-4,g!50kO2HgRYkMO_b5*)Y9S+tFANPtIlX,emWZp+`,FNO2IOod==sQ`$!-5r_A\'Xa])2CjG\GZ2*gf*YUgj+k!.QY>)n:%JbFtR^a25q5(:un\7RHK\'B+GI(oH0_LX,,rWa?r,7&QQKgnf)NiXcOq\'*:j%]r3[E_iGk"JNUW:T%Xahn"629""6qIW,0C;;`ffr,9]nH.AfG2^c3IqnTc8HE6q#"OYlF*^pWiKj%joI6;oB?CfZVXHtr!ajhQZWGbNC#q/h5X4?KMfm^=q!P;0OB2c(("@9QU!,/jfpKaC+5nFrcQAiqN*[(eu8N6r3+.HT67M(5Aggu3b#f72a1VFD(@>=oK\c!suo)St[,R:Ehd^)o0KcgX?<1mc&\'^J@&Iu+oLPu7p?YWr`GS75b1i_Qfo[sWYcqP4CKcq6FHpl&Zf$0%!XCURHGZ:#7W?(t9\\\'^J@&Iud.[$]9\'QLd/t0899Z2-&B<,/f5n`Vc[#Pple[,ZcLp#X=HU7;7=4AinBX2R3;J[L"#4Qs)q$;m0#]d"@3S%5nF/b&-P91"@3S%5nF/b&4B.i"4\Cp.f~>'
								,""
								# https://pdfshift.io/documentation
								,PDFShift::convertTo(str_replace("/../../", $url, $temp_path) . "/$temp_filename", (Array) $options, null)
							)
						);
					} else {
						$response->response = "cribbio!!!! in ambiente di dev non funziona. PDFSwift ha bisogno di poter accedere da remoto all'ubprint -.-'";
					}
					if ($fl_prod != 0) {
						unlink($temp_dest);
					}
					$response->status = true;
				} catch (Exception $e) {
					$response->response = "Errore generazione pdf: " . $e->getMessage();
				}
			} else {
				$response->response = "Errore generazione pdf: impossibile creare il file html";
			}
		} else {
			$response->response = "template is null";
		}
	} else {
		$response->response = "url is null";
	}

	return $response;
}
?>