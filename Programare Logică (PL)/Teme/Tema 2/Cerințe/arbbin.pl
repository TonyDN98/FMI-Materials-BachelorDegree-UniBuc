/* Vom reprezenta astfel arborii binari:
nil va fi arborele vid;
arb(Radacina,SubarboreStang,SubarboreDrept) va fi un arbore nevid. */

concat([],L,L).
concat([H|T],M,[H|L]) :- concat(T,M,L).

% Parcurgerile in preordine, inordine, postordine:

pre(nil,[]).
pre(arb(R,S,D),L) :- pre(S,M),pre(D,N),concat([R|M],N,L).

ino(nil,[]).
ino(arb(R,S,D),L) :- ino(S,M),ino(D,N),concat(M,[R|N],L).

post(nil,[]).
post(arb(R,S,D),L) :- post(S,M),post(D,N),concat(M,N,T),concat(T,[R],L).

/* Putem interoga:
?- pre(arb(1,arb(2,nil,arb(3,nil,nil)),arb(4,arb(5,nil,nil),arb(6,nil,nil))),L).
?- pre(arb(1,arb(2,nil,arb(3,nil,nil)),arb(4,arb(5,nil,nil),arb(6,nil,nil))),L),write(L).
*/

/* Putem afisa nodurile pe masura ce le parcurgem,
in loc sa le retinem intr-o lista: */

preord(nil).
preord(arb(R,S,D)) :- write(R),write(','),preord(S),preord(D).

% Lista frunzelor unui arbore binar:

lf(nil,[]).
lf(arb(F,nil,nil),[F]).
lf(arb(_,S,D),L) :- (S\=nil;D\=nil),lf(S,M),lf(D,N),concat(M,N,L).

/* pentru a nu fi generata de mai multe ori ca raspuns,
ar trebui analizate, pe rand, toate cazurile de
arbori stangi/drepti vizi/nevizi (TEMA FACULTATIVA) */

% Inaltimea unui arbore binar:

maxim(X,Y,X) :- X>=Y.
maxim(X,Y,Y) :- X<Y.

h(nil,0).
h(arb(_,S,D),H) :- h(S,Hs),h(D,Hd),maxim(Hs,Hd,Hm),H is Hm+1.

% Parcurgerea pe niveluri a unui arbore binar:

nivel(A,L) :- parcniv([A],L).

parcniv([],[]).
parcniv([nil|ListArb],L) :- parcniv(ListArb,L).
parcniv([arb(R,S,D)|ListArb],[R|L]) :- concat(ListArb,[S,D],ListaArbori),parcniv(ListaArbori,L).

/* Parcurgerea pe niveluri a unui arbore binar, cu
scrierea nodurilor pe ecran in timpul parcurgerii
in loc sa le retinem intr-o lista: */

niveluri(A) :- parcnivel([A]).

parcnivel([]).
parcnivel([nil|ListArb]) :- parcnivel(ListArb).
parcnivel([arb(R,S,D)|ListArb]) :- write(R),write(','),concat(ListArb,[S,D],ListaArbori),parcnivel(ListaArbori).

/* Reprezentarea grafica a unui arbore binar,
crescand din stanga ecranului: */

repr(A) :- desen(A,0).

desen(nil,_).
desen(arb(R,S,D),N) :- M is N+3,desen(D,M),nl,tab(N),write(R),nl,desen(S,M).

/* pentru folosire in SWISH SWI-Prolog-ul online,
a se inlocui tab(N) cu afisarea a N caractere
de alt tip (a se vedea liste.pl) */

minim(X,Y,X) :- X=<Y.
minim(X,Y,Y) :- X>Y.

% Valoarea minima dintr-un arbore binar:

minarb(arb(R,nil,nil),R).
minarb(arb(R,nil,arb(D,SD,RD)),M) :- minarb(arb(D,SD,RD),MD),minim(R,MD,M).
minarb(arb(R,arb(S,SS,RS),nil),M) :- minarb(arb(S,SS,RS),MS),minim(R,MS,M).
minarb(arb(R,arb(S,SS,RS),arb(D,SD,RD)),M) :- minarb(arb(S,SS,RS),MS),minarb(arb(D,SD,RD),MD),minim(MS,MD,MM),minim(R,MM,M).

% Valoarea maxima dintr-un arbore binar:

maxarb(arb(R,nil,nil),R).
maxarb(arb(R,nil,arb(D,SD,RD)),M) :- maxarb(arb(D,SD,RD),MD),maxim(R,MD,M).
maxarb(arb(R,arb(S,SS,RS),nil),M) :- maxarb(arb(S,SS,RS),MS),maxim(R,MS,M).
maxarb(arb(R,arb(S,SS,RS),arb(D,SD,RD)),M) :- maxarb(arb(S,SS,RS),MS),maxarb(arb(D,SD,RD),MD),maxim(MS,MD,MM),maxim(R,MM,M).

% Testam daca un arbore binar e arbore binar de cautare:

ecaut(nil).
ecaut(arb(_,nil,nil)).
ecaut(arb(R,nil,arb(D,SD,RD))) :- minarb(arb(D,SD,RD),MD),R<MD.
ecaut(arb(R,arb(S,SS,RS),nil)) :- maxarb(arb(S,SS,RS),MS),MS=<R.
ecaut(arb(R,arb(S,SS,RS),arb(D,SD,RD))) :- minarb(arb(D,SD,RD),MD),R<MD,maxarb(arb(S,SS,RS),MS),MS=<R.

/* Interogati:
?- ecaut(arb(1,arb(2,nil,arb(3,nil,nil)),arb(4,arb(5,nil,nil),arb(6,nil,nil)))).
?- ecaut(arb(10,arb(2,nil,arb(7,nil,nil)),arb(40,arb(15,nil,nil),arb(60,nil,nil)))).
?- ecaut(arb(10,arb(2,nil,arb(10,nil,nil)),arb(40,arb(15,nil,nil),arb(60,nil,nil)))).
?- ecaut(arb(10,arb(2,nil,arb(7,nil,nil)),arb(40,arb(10,nil,nil),arb(60,nil,nil)))).
 */

% Sortare de liste cu arbori binari de cautare:

arbsort(L,S) :- crearb(L,A),ino(A,S).

crearb([],nil).
crearb([H|T],B) :- crearb(T,A),insert(H,A,B).

insert(X,nil,arb(X,nil,nil)).
insert(X,arb(R,S,D),A) :- X=<R,insert(X,S,B),A=arb(R,B,D).
insert(X,arb(R,S,D),A) :- X>R,insert(X,D,B),A=arb(R,S,B).

/* Interogati:
?- arbsort([2,1,0,3,2,0,1,-1,3,0,-1],S).
?- arbsort([2,1,0,3,2,0,1,-1,3,0,-1],S),write(S).
 */

/*  Odata cu sortarea cu arbori binari de cautare, sa scriem, intr-un fisier arbcaut.txt, care e creat si deschis
de predicatul predefinit tell/1 (predicat unar; in aceasta scriere, 1 reprezinta aritatea, adica numarul de argumente),
dar poate fi si suprascris la urmatoarea apelare a predicatului arbsortfis/2 (predicat binar) de mai jos,
si este inchis de predicatul predefinit told/0 (predicat zeroar), arborele de cautare creat de predicatul crearb,
ca termen Prolog si grafic, crescand din stanga ecranului, impreuna cu lista obtinuta prin sortare. */

arbsortfis(L,S) :- tell('d:\\temporar\\arbcaut.txt'),crearb(L,A),ino(A,S),write(A),nl,write(S),nl,repr(A),told.

/* Eventual modificand in prealabil calea catre fisierul pentru scriere arbcaut.txt, interogati:
?- arbsortfis([2,1,-2,0,5,10,3,2,0,1,-1,3,0,-1],S).
apoi consultati fisierul arbcaut.txt. */
