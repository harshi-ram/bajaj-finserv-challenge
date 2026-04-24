'use client';

import { useState } from 'react';

const TreeNode = ({ name, children }) => {
  const childKeys = Object.keys(children || {});

  return (
    <div className="tree-node">
      <div className="node-content">
        {name}
      </div>
      {childKeys.length > 0 && (
        <div className="node-children">
          {childKeys.map(key => (
            <TreeNode key={key} name={key} children={children[key]} />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeVisualizer = ({ tree }) => {
  const rootKey = Object.keys(tree)[0];
  if (!rootKey) return null;

  return (
    <div className="tree-visualizer">
      <TreeNode name={rootKey} children={tree[rootKey]} />
    </div>
  );
};

export default function Home() {
  const [input, setInput] = useState('{\n "data": [\n "A->B", "A->C", "B->D", "C->E", "E->F",\n "X->Y", "Y->Z", "Z->X",\n "P->Q", "Q->R",\n "G->H", "G->H", "G->I",\n "hello", "1->2", "A->"\n ]\n}');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const parsedData = JSON.parse(input);
      const res = await fetch('/api/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch data');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message || 'Invalid JSON format');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <header>
        <div className="container">
          <h1>SRM Full Stack Challenge</h1>
        </div>
      </header>

      <div className="container">
        <div className="main-content">
          <section className="input-section">
            <div className="card">
              <h2>Input Data</h2>
              <p className="input-hint">
                Enter array.
              </p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{ "data": ["A->B", "B->C"] }'
              />
              {error && <div className="error-message">{error}</div>}
              <button
                className="btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Analyze Relationships'}
              </button>
            </div>

            {response && (
              <div className="card details-card">
                <h3>Details</h3>
                <div className="details-content">
                  <p><strong>User ID:</strong> {response.user_id}</p>
                  <p><strong>Email:</strong> {response.email_id}</p>
                  <p><strong>Roll Number:</strong> {response.college_roll_number}</p>
                </div>
                {response.invalid_entries.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <p><strong>Invalid Entries:</strong></p>
                    <div className="tag-list">
                      {response.invalid_entries.map((entry, i) => (
                        <span key={i} className="tag tag-neutral">{entry}</span>
                      ))}
                    </div>
                  </div>
                )}
                {response.duplicate_edges.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <p><strong>Duplicate Edges:</strong></p>
                    <div className="tag-list">
                      {response.duplicate_edges.map((edge, i) => (
                        <span key={i} className="tag tag-neutral">{edge}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="results-section">
            <div className="card" style={{ minHeight: '100%' }}>
              <h2>Structured Insights</h2>

              {!response ? (
                <div className="empty-state">
                  <p>Input data.</p>
                </div>
              ) : (
                <>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Total Trees</span>
                      <span className="summary-value">{response.summary.total_trees}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total Cycles</span>
                      <span className="summary-value">{response.summary.total_cycles}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Largest Root</span>
                      <span className="summary-value summary-value-large">{response.summary.largest_tree_root || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="hierarchy-list">
                    {response.hierarchies.map((h, index) => (
                      <div key={index} className="card hierarchy-card">
                        <div className="hierarchy-header">
                          <h3>Root: {h.root}</h3>
                          {h.has_cycle ? (
                            <span className="tag tag-cycle">Cycle Detected</span>
                          ) : (
                            <span className="tag tag-tree">Tree (Depth: {h.depth})</span>
                          )}
                        </div>
                        <div className="tree-visual-container">
                          {h.has_cycle ? (
                            <div className="cycle-view">
                              <p>A cycle was detected.</p>
                            </div>
                          ) : (
                            <TreeVisualizer tree={h.tree} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}
