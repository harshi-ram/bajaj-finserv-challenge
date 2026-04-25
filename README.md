# SRM Full Stack Challenge

## Features

- **Node Relationship Tree Visualization**: Hierarchical tree structures are made from parent-child string inputs.
- **Cycle Detection**: Cyclic relationships are detected within the data and then marked.
- **Tree Properties**: Total trees, total cycles, and the largest tree by depth are identified.
- **Validation**: Invalid string formats are filtered.

## Tech Stack

- **Framework**: Next.js
- **Library**: React
- **Styling**: Vanilla CSS
- **API**: Next.js Serverless Functions

## API 

### POST `/api/bfhl`

It processes an array of relationship strings and returns structured hierarchical data.

**Request Body:**
```json
{
  "data": [
    "A->B",
    "A->C",
    "B->D",
    "X->Y",
    "Y->Z",
    "Z->X"
  ]
}
```

**Response Properties:**
- `user_id`: Unique identifier 
- `email_id`: User's email address.
- `college_roll_number`: User's college roll number.
- `hierarchies`: Array of root objects containing either the tree structure or cycle status.
- `invalid_entries`: List of inputs that didn't match the `P->C` pattern.
- `duplicate_edges`: List of redundant relationship definitions.
- `summary`: High-level stats about the processed data.

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/harshi-ram/bajaj-finserv-challenge/
   cd bajaj-finserv-challenge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser.

