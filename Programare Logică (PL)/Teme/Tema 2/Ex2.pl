femeie(ana). femeie(carmen). femeie(elena). femeie(eva).
femeie(maria). femeie(sara). femeie(valentina).
barbat(adam). barbat(constantin). barbat(eugen). barbat(george).
barbat(ion). barbat(iosif). barbat(tudor). barbat(victor).
parinte(sara,adam). parinte(sara,eva).
parinte(constantin,iosif). parinte(constantin,elena).
parinte(valentina,ion). parinte(valentina,sara).
parinte(victor,constantin). parinte(victor,maria).
parinte(ana,victor). parinte(ana,valentina).
parinte(carmen,victor). parinte(carmen,valentina). 
parinte(george,victor). parinte(george,valentina).
parinte(eugen,tudor). parinte(eugen,ana).
frati(X,Y) :- parinte(X,P), parinte(Y,P), X\=Y.
tata(X,T) :- parinte(X,T), barbat(T).
mama(X,M) :- parinte(X,M), femeie(M).
unchi(X,U) :- parinte(X,P), frati(P,U), barbat(U).
matusa(X,M) :- parinte(X,P), frati(P,M), femeie(M).
bunic(X,B) :- parinte(X,P), parinte(P,B). stramos(X,X,0). % al treilea argument e numarul de generatii
stramos(X,S,G) :- parinte(X,P), stramos(P,S,H), G is H + 1.

%arbgen(A,arb(A,S,D)):-tata(A,B),S is arb(B,arb(B,M,N)),D is arb(C,arb(C,X,Y)),mama(A,C).
arbgen(A,arb(A,nil,nil)):-not(parinte(A,_)).

arbgen(A,arb(A,S,D)):-tata(A,B),arbgen(B,arb(B,M,N)),=(S,arb(B,arb(B,M,N))),
                      mama(A,C),arbgen(C,arb(C,X,Y)),=(D, arb(C,arb(C,X,Y))).
/*
?- parinte(C,victor). % Care sunt copiii lui Victor?
?- parinte(F,victor), femeie(F). % Care sunt fiicele lui Victor?
?- stramos(carmen,S,3), barbat(S). % Care sunt strabunicii (cunoscuti, adica din baza de cunostinte de mai sus, ai) lui Carmen?
?- tata(X,T),stramos(T,elena,G). % Pentru cine este Elena stramos din partea tatalui, cine este tatal acelui urmas si cate generatii sunt intre tata si Elena? 
*/
    
%A = arb(carmen, arb(victor, arb(constantin, arb(iosif, nil, nil), arb(elena, nil, nil)),
% arb(maria, nil, nil)),arb(valentina, arb(ion, nil, nil), arb(sara, arb(adam, nil, nil),
%  arb(eva, nil, nil)))).