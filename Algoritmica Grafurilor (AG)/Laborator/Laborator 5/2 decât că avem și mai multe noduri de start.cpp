#include <iostream>
#include <fstream>
#include <set>
#include <list>
#include <utility>
using namespace std;

int ch[100]; //vector caracteristic - marcheaza cu 1 prezenta punctelor de control
void afisare(int x, int t[])
{
    if(t[x]!=0) afisare(t[x], t);
    cout<<x<<" ";
}
int main ()
{
	int n, m, p, i, t[100], d[100], st[100], x, y, nr;
	ifstream fin("graf.txt"); fin>>n>>m;
	list <pair <int, int>> L[100]; //liste de adiacenta
	for(i=0; i<m; i++)
    {
        fin>>x>>y>>p;
        L[x].push_back({p, y});
        L[y].push_back({p, x}); //pt ca am graf neorientat
    }
    fin.close();

    //Initializare
    for(i=1; i<=n; i++)
    {
        d[i]=10000; //infinitul
        t[i]=0;
    }
    cout << "Introduceti Nr Noduri Start: "; cin >> nr;
    for(i=0; i<nr; i++) cin>>st[i], d[st[i]]=0;

    //fiecare nod va aparea in "coada de prioritati" cel mult o data, dar valoarea lui x se poate updata
    //set e pt multimi
	set <pair <int, int>> Q; //1 int=d[x]=distanta; 2 int=eticheta nod
	for(i=0; i<nr; i++) Q.insert({d[st[i]], st[i]});

	int k, aux; cout << "Nr Puncte de Control: "; cin >> k;
    for(i=1; i<=k; i++)
    {cin >> aux; ch[aux]=1;}

	while(Q.size()>0)
    {
        x=Q.begin()->second;
        if(ch[x]==1) break;
        Q.erase(Q.begin()); //sau Q.erase({d[x], x});
        for(pair <int, int> it: L[x]) //pt fiecare vecin a lui L[x]
        {
            y=it.second; p=it.first; //p=pondere
            if(d[y]>d[x]+p)
            {
                Q.erase({d[y], y});
                d[y]=d[x]+p; t[y]=x;
                Q.insert({d[y], y});
            }
        }
    }
    cout<<"Cel mai apropiat punct de control de start este: "<<x<<endl;
    cout<<"Drum: "; afisare(x, t);

	return 0;
}
