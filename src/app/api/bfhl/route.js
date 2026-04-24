import { NextResponse } from 'next/server';
let lastResult = {
  message: "api ready",
  status: "ready"
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  return NextResponse.json(lastResult, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function POST(req) {
  try {
    const { data } = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid input: 'data' must be an array" }, {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const response = {
      user_id: "johndoe_17091999",
      email_id: "john.doe@college.edu",
      college_roll_number: "21CS1001",
    };

    const invalid_entries = [];
    const validRaw = [];
    const edgeRegex = /^[A-Z]->[A-Z]$/;

    data.forEach(item => {
      if (typeof item === 'string' && edgeRegex.test(item)) {
        validRaw.push(item);
      } else {
        invalid_entries.push(String(item));
      }
    });

    const seenEdges = new Set();
    const duplicate_edges = [];
    const uniqueEdges = [];

    validRaw.forEach(edge => {
      if (seenEdges.has(edge)) {
        if (!duplicate_edges.includes(edge)) {
          duplicate_edges.push(edge);
        }
      } else {
        seenEdges.add(edge);
        uniqueEdges.push(edge);
      }
    });

    const childToParent = new Map();
    const parentToChildren = new Map();
    const allNodes = new Set();

    uniqueEdges.forEach(edge => {
      const [p, c] = edge.split('->');
      allNodes.add(p);
      allNodes.add(c);

      if (!childToParent.has(c)) {
        childToParent.set(c, p);
        if (!parentToChildren.has(p)) parentToChildren.set(p, new Set());
        parentToChildren.get(p).add(c);
      }
    });

    const roots = Array.from(allNodes).filter(node => !childToParent.has(node)).sort();

    const hierarchies = [];
    const visitedNodes = new Set();

    const buildTree = (node, path = new Set()) => {
      if (path.has(node)) return { cycle: true };

      visitedNodes.add(node);
      path.add(node);

      const tree = {};
      const children = parentToChildren.get(node) || [];
      let hasCycle = false;

      for (const child of Array.from(children).sort()) {
        const res = buildTree(child, new Set(path));
        if (res.cycle) {
          hasCycle = true;
          break;
        }
        tree[child] = res.tree;
      }

      return hasCycle ? { cycle: true } : { tree };
    };
    roots.forEach(root => {
      const res = buildTree(root);
      if (res.cycle) {
        hierarchies.push({
          root,
          tree: {},
          has_cycle: true
        });
      } else {
        const fullTree = { [root]: res.tree };
        const getDepth = (t) => {
          const keys = Object.keys(t);
          if (keys.length === 0) return 0;
          return 1 + Math.max(...keys.map(k => getDepth(t[k])));
        };
        hierarchies.push({
          root,
          tree: fullTree,
          depth: 1 + getDepth(res.tree)
        });
      }
    });

    const remainingNodes = Array.from(allNodes).filter(n => !visitedNodes.has(n)).sort();

    const unvisited = new Set(remainingNodes);
    while (unvisited.size > 0) {
      const component = [];
      const startNode = Array.from(unvisited).sort()[0];

      const queue = [startNode];
      while (queue.length > 0) {
        const curr = queue.shift();
        if (unvisited.has(curr)) {
          unvisited.delete(curr);
          component.push(curr);

          const p = childToParent.get(curr);
          if (p && unvisited.has(p)) queue.push(p);
          const cs = parentToChildren.get(curr) || [];
          cs.forEach(c => { if (unvisited.has(c)) queue.push(c); });
        }
      }

      const componentRoot = component.sort()[0];
      hierarchies.push({
        root: componentRoot,
        tree: {},
        has_cycle: true
      });
    }

    const validTrees = hierarchies.filter(h => !h.has_cycle);
    const summary = {
      total_trees: validTrees.length,
      total_cycles: hierarchies.length - validTrees.length,
      largest_tree_root: validTrees.length > 0
        ? validTrees.reduce((max, h) => {
          if (h.depth > max.depth) return h;
          if (h.depth === max.depth && h.root < max.root) return h;
          return max;
        }).root
        : null
    };

    const finalResponse = {
      ...response,
      hierarchies,
      invalid_entries,
      duplicate_edges,
      summary
    };

    lastResult = finalResponse;
    return NextResponse.json(finalResponse, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}
