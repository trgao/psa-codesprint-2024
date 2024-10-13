#include<bits/stdc++.h>
using namespace std;

const int N = 200;

/* Complexity: O(n^3) but optimized
It finds minimum cost maximum matching.
For finding maximum cost maximum matching
add -cost and return -matching()
1-indexed
Author: code-library author on codeforces*/
struct Hungarian {
    long long c[N][N], fx[N], fy[N], d[N];
    int l[N], r[N], arg[N], trace[N];
    queue<int> q;
    const long long inf = 1e18;
    int start, finish, n;
    Hungarian() {}
    Hungarian(int n1, int n2): n(max(n1, n2)) {
        for (int i = 1; i <= n; ++i) {
            fy[i] = l[i] = r[i] = 0;
            for (int j = 1; j <= n; ++j) c[i][j] = inf; // make it 0 for maximum cost matching (not necessarily with max count of matching)
        }
    }
    void add_edge(int u, int v, long long cost) {
        c[u][v] = min(c[u][v], cost);
    }
    inline long long getC(int u, int v) {
        return c[u][v] - fx[u] - fy[v];
    }
    void initBFS() {
        while (!q.empty()) q.pop();
        q.push(start);
        for (int i = 0; i <= n; ++i) trace[i] = 0;
        for (int v = 1; v <= n; ++v) {
            d[v] = getC(start, v);
            arg[v] = start;
        }
        finish = 0;
    }
    void findAugPath() {
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v = 1; v <= n; ++v) if (!trace[v]) {
                    long long w = getC(u, v);
                    if (!w) {
                        trace[v] = u;
                        if (!r[v]) {
                            finish = v;
                            return;
                        }
                        q.push(r[v]);
                    }
                    if (d[v] > w) {
                        d[v] = w;
                        arg[v] = u;
                    }
                }
        }
    }
    void subX_addY() {
        long long delta = inf;
        for (int v = 1; v <= n; ++v) if (trace[v] == 0 && d[v] < delta) {
                delta = d[v];
            }
        // Rotate
        fx[start] += delta;
        for (int v = 1; v <= n; ++v) if(trace[v]) {
                int u = r[v];
                fy[v] -= delta;
                fx[u] += delta;
            } else d[v] -= delta;
        for (int v = 1; v <= n; ++v) if (!trace[v] && !d[v]) {
                trace[v] = arg[v];
                if (!r[v]) {
                    finish = v;
                    return;
                }
                q.push(r[v]);
            }
    }
    void Enlarge() {
        do {
            int u = trace[finish];
            int nxt = l[u];
            l[u] = finish;
            r[finish] = u;
            finish = nxt;
        } while (finish);
    }
    long long maximum_matching() {
        for (int u = 1; u <= n; ++u) {
            fx[u] = c[u][1];
            for (int v = 1; v <= n; ++v) {
                fx[u] = min(fx[u], c[u][v]);
            }
        }
        for (int v = 1; v <= n; ++v) {
            fy[v] = c[1][v] - fx[1];
            for (int u = 1; u <= n; ++u) {
                fy[v] = min(fy[v], c[u][v] - fx[u]);
            }
        }
        for (int u = 1; u <= n; ++u) {
            start = u;
            initBFS();
            while (!finish) {
                findAugPath();
                if (!finish) subX_addY();
            }
            Enlarge();
        }
        long long ans = 0;
        for (int i = 1; i <= n; ++i) {
            if (c[i][l[i]] != inf) ans += c[i][l[i]];
            else l[i] = 0;
        }
        return ans;
    }
};

int32_t main() {
    ios_base::sync_with_stdio(0);
    cin.tie(0);
    //input: adj matrix, then vector of capacity for mentors
    //row is mentor == n1, col is mentee == n2
    int n1, n2;
    cin >> n1 >> n2;
    vector<vector<int>> adjacencyMatrix(n1, vector<int>(n2));

    for (int i = 1; i <= n1; i++) {
        for (int j = 1; j <= n2; ++j) {
            int w;
            cin >> adjacencyMatrix[i-1][j-1];
            // M.add_edge(i, j, -w);
        }
    }
    vector<int> capacities(n1);
    for (int i = 1; i <= n1; i++) cin >> capacities[i - 1];
    int expandedN1 = accumulate(capacities.begin(), capacities.end(), 0);
    Hungarian M(expandedN1, n2);
    int ptr = 0;
    int tot = capacities[0]; //End of current range
    for (int i = 1; i <= expandedN1; i++) {
        for (int j = 1; j <= n2; ++j) {
            M.add_edge(i, j, -adjacencyMatrix[ptr][j-1]);
        }
        if (i >= tot) {
            ptr++;
            tot += capacities[ptr];
        }
    }
    -M.maximum_matching();
    // for (int i = 1; i <= expandedN1; i++) cout << M.l[i] << ' ';
    // cout << '\n';
    ptr = 0;
    tot = capacities[0]; //End of current range
    for (int i = 1; i <= expandedN1; i++) {
        if (M.l[i]) cout << M.l[i]-1 << ' ';
        if (i >= tot) {
            if (i != expandedN1) cout << endl;
            ptr++;
            tot += capacities[ptr];
        }
    }
    return 0;
}
