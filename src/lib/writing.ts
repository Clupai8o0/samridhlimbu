export type ContentBlock =
  | { type: 'paragraph'; html: string; dropCap?: boolean }
  | { type: 'blockquote'; html: string }
  | { type: 'heading'; text: string; level: 2 | 3 }
  | { type: 'code'; lang?: string; code: string; label?: string }
  | { type: 'image'; src: string; alt: string; caption?: string; lightBg?: boolean }
  | { type: 'video'; href: string; label: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'equation'; html: string; caption?: string }
  | ChartBlock

// A themed bar or line chart, drawn by <ArticleChart>. One value per category in
// every series, all on one y axis. Bars always start at zero; a line can set yMin.
export type ChartBlock = {
  type: 'chart'
  kind: 'bar' | 'line'
  title: string
  subtitle?: string
  caption?: string
  xLabel?: string
  unit?: string
  yMin?: number
  categories: string[]
  series: { name: string; values: number[] }[]
}

export type Post = {
  slug: string
  title: string
  date: string
  readMin: number
  tags: string[]
  excerpt: string
  featured?: boolean
  authors?: { name: string; role?: string }[]
  content?: ContentBlock[]
}

const CERT_IMPORTS = `from datetime import datetime, timedelta, timezone

from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa`

const CERT_PRIVATE_KEY = `# 1. Generate a private key
private_key = rsa.generate_private_key(
  public_exponent=65537,
  key_size=2048,
)`

const CERT_PUBLIC_KEY = `# 2. Generating public key from private key
public_key = private_key.public_key()`

const CERT_SUBJECT = `# 3. Define the certificate subject
subject = issuer = x509.Name([
  x509.NameAttribute(NameOID.COMMON_NAME, u"localhost")
])
# Different CN for the client cert
if cert_name_prefix == "client":
  subject = issuer = x509.Name([
    x509.NameAttribute(NameOID.COMMON_NAME, u"client.localhost"),
  ])`

const CERT_BUILDER = `# 4. Build the certificate
cert = x509.CertificateBuilder().subject_name(subject
).issuer_name(issuer
).public_key(public_key
).serial_number(x509.random_serial_number()
).not_valid_before(datetime.now(timezone.utc)
).not_valid_after(datetime.now(timezone.utc) + timedelta(days=365)
).add_extension(
  x509.SubjectAlternativeName([x509.DNSName(u"localhost")]),
  critical=False,
).sign(private_key, hashes.SHA256())`

const CERT_SAVE = `# 5. Save the private key and certificate in PEM format
with open(f"{cert_name_prefix}.key", "wb") as f:
  f.write(private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
  ))

with open(f"{cert_name_prefix}.crt", "wb") as f:
  f.write(cert.public_bytes(serialization.Encoding.PEM))`

const CERT_INVOKE = `if __name__ == "__main__":
  generate_cert("server")
  generate_cert("client")`

const SERVER_IMPORTS = `import socket
import ssl
import threading
import logging
from datetime import datetime`

const SERVER_SOCKET_AND_CTX = `# Create base socket
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server_socket.bind((host, port))
server_socket.listen(5)

# Create SSL context
ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.verify_mode = ssl.CERT_REQUIRED
ssl_context.load_cert_chain(certfile="server.crt", keyfile="server.key")
ssl_context.load_verify_locations("client.crt")`

const SERVER_ACCEPT_WRAP = `client_socket, address = server_socket.accept()
ssl_socket = self.ssl_context.wrap_socket(client_socket, server_side=True)`

const SERVER_THREAD = `client_thread = threading.Thread(target=handle_client, args=(client_socket, address))
client_thread.daemon = True
client_thread.start()`

const SERVER_RECV_BROADCAST = `msg = ssl_socket.recv(1024).decode('utf-8')

for client in clients:
  if client != sender:
    client.send(msg.encode('utf-8'))`

const SERVER_LOGGING = `logging.basicConfig(
  level=logging.INFO,
  format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

logger.info("Message log...")
logger.error("Error...")`

const CLIENT_SETUP = `# Create base socket
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Create SSL context
ssl_context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
ssl_context.load_cert_chain(certfile="client.crt", keyfile="client.key")
ssl_context.check_hostname = False  # for development only
ssl_context.verify_mode = ssl.CERT_REQUIRED
ssl_context.load_verify_locations("server.crt")

# Wrap socket with SSL
ssl_socket = self.ssl_context.wrap_socket(client_socket, server_hostname=host)`

const CLIENT_CONNECT = `ssl_socket.connect((host, port))`

const CLIENT_SEND = `message = input()
formatted_message = f"{username}: {message}"
ssl_socket.send(formatted_message.encode('utf-8'))`

const CLIENT_RECV = `# Receive messages
message = self.ssl_socket.recv(1024).decode('utf-8')

# Start a receiving thread
receive_thread = threading.Thread(target=self.receive_messages)
receive_thread.daemon = True
receive_thread.start()`

const FULL_GENERATE_CERTS = `from datetime import datetime, timedelta, timezone

from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa

def generate_cert(cert_name_prefix="server"):
  # 1. Generate a private key
  private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
  )

  # 2. Generate public key from the private key
  public_key = private_key.public_key()

  # 3. Define the certificate subject
  subject = issuer = x509.Name([
    x509.NameAttribute(NameOID.COMMON_NAME, u"localhost")
  ])
  if cert_name_prefix == "client":
    subject = issuer = x509.Name([
      x509.NameAttribute(NameOID.COMMON_NAME, u"client.localhost"),
    ])

  # 4. Build the certificate
  cert = x509.CertificateBuilder().subject_name(subject
  ).issuer_name(issuer
  ).public_key(public_key
  ).serial_number(x509.random_serial_number()
  ).not_valid_before(datetime.now(timezone.utc)
  ).not_valid_after(datetime.now(timezone.utc) + timedelta(days=365)
  ).add_extension(
    x509.SubjectAlternativeName([x509.DNSName(u"localhost")]),
    critical=False,
  ).sign(private_key, hashes.SHA256())

  # 5. Save the private key and the certificate
  with open(f"{cert_name_prefix}.key", "wb") as f:
    f.write(private_key.private_bytes(
      encoding=serialization.Encoding.PEM,
      format=serialization.PrivateFormat.PKCS8,
      encryption_algorithm=serialization.NoEncryption()
    ))
  with open(f"{cert_name_prefix}.crt", "wb") as f:
    f.write(cert.public_bytes(serialization.Encoding.PEM))

  print(f"Generated {cert_name_prefix}.key and {cert_name_prefix}.crt successfully")

if __name__ == "__main__":
  generate_cert("server")
  generate_cert("client")`

const FULL_SERVER = `import socket
import ssl
import threading
import logging
from datetime import datetime

logging.basicConfig(
  level=logging.INFO,
  format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

class SecureChatServer:
  def __init__(self, host="localhost", port=8443):
    self.host = host
    self.port = port
    self.clients = []
    self.setup_server()

  def setup_server(self):
    self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    self.server_socket.bind((self.host, self.port))
    self.server_socket.listen(5)

    self.ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    self.ssl_context.verify_mode = ssl.CERT_REQUIRED
    self.ssl_context.load_cert_chain(certfile="server.crt", keyfile="server.key")
    self.ssl_context.load_verify_locations("client.crt")

    logger.info(f"Server listening on {self.host}:{self.port}")

  def handle_client(self, client_socket, address):
    ssl_socket = self.ssl_context.wrap_socket(client_socket, server_side=True)
    logger.info(f"Secure connection established with {address}")
    self.clients.append(ssl_socket)

    try:
      while True:
        message = ssl_socket.recv(1024).decode('utf-8')
        if not message:
          break

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        formatted = f"[{timestamp}] {address}: {message}"
        logger.info(formatted)
        self.broadcast(formatted, ssl_socket)
    finally:
      if ssl_socket in self.clients:
        self.clients.remove(ssl_socket)
      ssl_socket.close()

  def broadcast(self, message, sender_socket=None):
    for client in self.clients:
      if client != sender_socket:
        try:
          client.send(message.encode('utf-8'))
        except Exception:
          self.clients.remove(client)

  def start(self):
    while True:
      client_socket, address = self.server_socket.accept()
      t = threading.Thread(target=self.handle_client, args=(client_socket, address))
      t.daemon = True
      t.start()

if __name__ == "__main__":
  SecureChatServer().start()`

const FULL_CLIENT = `import socket
import ssl
import threading
import logging
import sys

logging.basicConfig(
  level=logging.INFO,
  format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

class SecureChatClient:
  def __init__(self, host="localhost", port=8443):
    self.host = host
    self.port = port
    self.username = None
    self.setup_client()

  def setup_client(self):
    self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    self.ssl_context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
    self.ssl_context.load_cert_chain(certfile="client.crt", keyfile="client.key")
    self.ssl_context.check_hostname = False  # for development only
    self.ssl_context.verify_mode = ssl.CERT_REQUIRED
    self.ssl_context.load_verify_locations("server.crt")

    self.ssl_socket = self.ssl_context.wrap_socket(
      self.client_socket, server_hostname=self.host
    )

  def send_message(self, message):
    formatted = f"{self.username}: {message}"
    self.ssl_socket.send(formatted.encode('utf-8'))

  def receive_messages(self):
    while True:
      message = self.ssl_socket.recv(1024).decode('utf-8')
      if not message:
        break
      sys.stdout.write('\\r\\033[K')
      print(message)
      sys.stdout.write('> ')
      sys.stdout.flush()

  def start(self):
    self.ssl_socket.connect((self.host, self.port))
    self.username = input("Enter your username: ").strip()
    self.send_message("has joined the chat")

    t = threading.Thread(target=self.receive_messages)
    t.daemon = True
    t.start()

    while True:
      sys.stdout.write('> ')
      sys.stdout.flush()
      message = input()
      if message.lower() == 'quit':
        self.send_message("has left the chat")
        break
      self.send_message(message)

if __name__ == "__main__":
  SecureChatClient().start()`

const TODO_SCAFFOLD = `function App() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">My Todo App</h1>
        <div className="flex justify-center gap-6 text-sm text-gray-600">
          {/* stats land here later */}
        </div>
      </header>

      <main>
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* todo app goes here */}
        </div>

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with React — perfect for learning.</p>
        </footer>
      </main>
    </div>
  );
}`

const TODO_STUBS = `const TodoItem = () => (
  <li className="p-4 bg-white rounded-lg mb-2 shadow-sm">Todo</li>
);

const TodoList = () => (
  <ul className="space-y-0">
    <TodoItem />
    <TodoItem />
    <TodoItem />
  </ul>
);`

const TODO_USESTATE = `import { useState } from "react";

function App() {
  const [todos] = useState([
    { id: 1, text: "Learn React basics", completed: true },
    { id: 2, text: "Build a todo app", completed: false },
    { id: 3, text: "Practice state management", completed: false },
  ]);

  return (
    /* ...same layout... */
    <TodoList todos={todos} />
  );
}

const TodoList = ({ todos }) => (
  <ul className="space-y-0">
    {todos.map((t) => (
      <TodoItem key={t.id} todo={t} />
    ))}
  </ul>
);`

const TODO_ITEM_STYLED = `const TodoItem = ({ todo }) => (
  <li
    className={\`flex items-center gap-3 p-4 bg-white rounded-lg mb-2 shadow-sm
      hover:shadow-md transition-all duration-200
      \${todo.completed ? "opacity-70" : ""}\`}
  >
    <input
      type="checkbox"
      checked={todo.completed}
      className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-300"
    />
    <span
      className={\`flex-1 text-gray-800 \${
        todo.completed ? "line-through text-gray-500" : ""
      }\`}
    >
      {todo.text}
    </span>
    <button className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors">
      Delete
    </button>
  </li>
);`

const TODO_TOGGLE = `function App() {
  const [todos, setTodos] = useState([/* ... */]);

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  return (
    /* ... */
    <TodoList todos={todos} onToggle={toggleTodo} />
  );
}

const TodoItem = ({ todo, onToggle }) => (
  /* ... */
  <input
    type="checkbox"
    checked={todo.completed}
    onChange={() => onToggle(todo.id)}
    className="..."
  />
  /* ... */
);`

const TODO_FORM = `const TodoForm = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none text-gray-700"
      />
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Add Task
      </button>
    </div>
  );
};

const addTodo = (text) => {
  setTodos([...todos, { id: Date.now(), text, completed: false }]);
};`

const TODO_DELETE = `const deleteTodo = (id) => {
  setTodos(todos.filter((t) => t.id !== id));
};

<TodoItem
  key={t.id}
  todo={t}
  onToggle={onToggle}
  onDelete={onDelete}
/>

<button
  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
  onClick={() => onDelete(todo.id)}
>
  Delete
</button>`

const TODO_FILTERS = `const [filter, setFilter] = useState("all");

const filteredTodos = todos.filter((t) => {
  if (filter === "active") return !t.completed;
  if (filter === "completed") return t.completed;
  return true;
});

const FilterButtons = ({ currentFilter, onFilterChange }) => {
  const filters = ["all", "active", "completed"];
  return (
    <div className="flex justify-center gap-2 mb-4">
      {filters.map((f) => (
        <button
          key={f}
          className={\`px-4 py-2 rounded-full border-2 transition-all \${
            currentFilter === f
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
          }\`}
          onClick={() => onFilterChange(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
};

// Empty state inside TodoList
if (todos.length === 0) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 italic text-lg">No tasks to display</p>
      <p className="text-gray-400 text-sm mt-2">
        Add a task above to get started!
      </p>
    </div>
  );
}`

const TODO_STATS = `const totalTodos = todos.length;
const completedTodos = todos.filter((t) => t.completed).length;
const activeTodos = totalTodos - completedTodos;

// In the header:
<div className="flex justify-center gap-6 text-sm text-gray-600">
  <span className="bg-white px-3 py-1 rounded-full shadow-sm">
    <strong>Total:</strong> {totalTodos}
  </span>
  <span className="bg-white px-3 py-1 rounded-full shadow-sm">
    <strong>Active:</strong> {activeTodos}
  </span>
  <span className="bg-white px-3 py-1 rounded-full shadow-sm">
    <strong>Completed:</strong> {completedTodos}
  </span>
</div>`

const TODO_FINAL = `import "./App.css";
import { useState } from "react";

const TodoItem = ({ todo, onToggle, onDelete }) => (
  <li
    className={\`flex items-center gap-3 p-4 bg-white rounded-lg mb-2 shadow-sm
      hover:shadow-md transition-all duration-200
      \${todo.completed ? "opacity-70" : ""}\`}
  >
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => onToggle(todo.id)}
      className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-300"
    />
    <span
      className={\`flex-1 text-gray-800 \${
        todo.completed ? "line-through text-gray-500" : ""
      }\`}
    >
      {todo.text}
    </span>
    <button
      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
      onClick={() => onDelete(todo.id)}
    >
      Delete
    </button>
  </li>
);

const TodoList = ({ todos, onToggle, onDelete }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 italic text-lg">No tasks to display</p>
        <p className="text-gray-400 text-sm mt-2">
          Add a task above to get started!
        </p>
      </div>
    );
  }
  return (
    <ul className="space-y-0">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

const TodoForm = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState("");
  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };
  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none text-gray-700"
      />
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Add Task
      </button>
    </div>
  );
};

const FilterButtons = ({ currentFilter, onFilterChange }) => {
  const filters = ["all", "active", "completed"];
  return (
    <div className="flex justify-center gap-2 mb-4">
      {filters.map((filter) => (
        <button
          key={filter}
          className={\`px-4 py-2 rounded-full border-2 transition-all \${
            currentFilter === filter
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
          }\`}
          onClick={() => onFilterChange(filter)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React basics", completed: true },
    { id: 2, text: "Build a todo app", completed: false },
    { id: 3, text: "Practice state management", completed: false },
  ]);
  const [filter, setFilter] = useState("all");

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const activeTodos = totalTodos - completedTodos;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">My Todo App</h1>
        <div className="flex justify-center gap-6 text-sm text-gray-600">
          <span className="bg-white px-3 py-1 rounded-full shadow-sm">
            <strong>Total:</strong> {totalTodos}
          </span>
          <span className="bg-white px-3 py-1 rounded-full shadow-sm">
            <strong>Active:</strong> {activeTodos}
          </span>
          <span className="bg-white px-3 py-1 rounded-full shadow-sm">
            <strong>Completed:</strong> {completedTodos}
          </span>
        </div>
      </header>

      <main>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <TodoForm onAdd={addTodo} />
          <FilterButtons currentFilter={filter} onFilterChange={setFilter} />
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </div>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with React — perfect for learning.</p>
        </footer>
      </main>
    </div>
  );
}
export default App;`

const BLOCK_AND_BLOCK = `Block 0 (Genesis)
  data: none
  hash: 0000…0000

Block 1
  data:  Alice → Bob 1 BTC
  prev:  0000…0000
  hash:  a3c1c3a7…d053f31

Block 2
  data:  Bob → Charlie 0.5 BTC
  prev:  a3c1c3a7…d053f31
  hash:  b4e9dbb5…fb5129e`

const SHA_ROUND = `T1 = h + Σ1(e) + Ch(e,f,g) + Kt + Wt
T2 = Σ0(a) + Maj(a,b,c)

h = g
g = f
f = e
e = d + T1
d = c
c = b
b = a
a = T1 + T2`

const ALLARKIVE_RETRIEVE = `def _retrieve(query: str) -> list[dict]:
    # 1. Embed the query with nomic-embed-text
    emb    = _embed_query(query)
    packed = quant.pack(emb, _QUANTIZATION)

    # 2. Dense KNN search in sqlite-vec
    dense = _dense_search(packed, _TOP_K)
    # 3. BM25 Xapian search across large ZIMs (hybrid mode, Pi profile)
    bm25  = _bm25_search(query, _BM25_K)

    # 4. Reciprocal Rank Fusion merge
    merged = _rrf_merge(dense, bm25) if bm25 else dense
    merged = merged[:_TOP_K]

    # 5. Hydrate text lazily — chunks stored as (char_offset, char_len) pointers
    #    into the ZIM, not as stored text. Keeps index at ~25% of ZIM size.
    passages: list[dict] = []
    for p in merged:
        text = _read_article_text(p["zim_name"], p["article_path"])
        if text is None:
            continue
        snippet = text[p["char_offset"]: p["char_offset"] + p["char_len"]].strip()
        if not snippet:
            continue
        passages.append({**p, "text": snippet})
    return passages`

const ALLARKIVE_REFUSAL = `@app.post("/v1/chat/completions")
def chat_completions(req: _ChatRequest):
    query = next(
        (m.text() for m in reversed(req.messages) if m.role == "user"),
        None,
    )
    if not query:
        raise HTTPException(status_code=400, detail="no user message")

    # Step 1 — vector search across the local archive
    try:
        passages = _retrieve(query)
    except Exception as exc:
        log.error("retrieval error: %s", exc)
        raise HTTPException(status_code=500, detail="retrieval failed")

    # Step 2 — if retrieval returns nothing, the LLM is never invoked.
    # This is not a prompt instruction. This is a code branch.
    # The model cannot hallucinate because it is never called.
    if not passages:
        answer = NO_SOURCES_TEXT
    elif _SEARCH_ONLY:
        answer = _format_passages_as_citations(passages, _KIWIX_PUBLIC_URL)
    else:
        system   = build_system_prompt(passages)
        llm_msgs = [{"role": "system", "content": system}] + [
            {"role": m.role, "content": m.text()}
            for m in req.messages if m.role != "system"
        ]
        raw    = _call_ollama(llm_msgs)
        answer = rewrite_citations(raw, passages, _KIWIX_PUBLIC_URL)

    if req.stream:
        return StreamingResponse(_stream_text(answer), media_type="text/event-stream")
    return _full_response(answer)`

const ALLARKIVE_PROMPT = `_SYSTEM_TEMPLATE = """\\
You are AllArkive's research assistant. You answer using the passages provided below.

Rules:
1. Cite every factual claim with [N] notation corresponding to the passage number.
2. Use only information from the passages. Do not add facts from outside them.
3. If a passage discusses the topic — even tangentially — synthesise what it
   says and cite it. Partial answers are useful; say what the passages cover.
4. Only respond with "no sources found for this question." when the passages
   have no connection to the user's topic at all.
5. Do not invent citations. If you cannot support a statement, omit it.

Passages:
{passages}
"""`

const ALLARKIVE_CITATIONS = `def rewrite_citations(text: str, passages: list[dict], kiwix_public_url: str) -> str:
    """Turn [N] markers in model output into [[N: Article Title]](kiwix://…) links."""
    base = kiwix_public_url.rstrip("/")

    def _replace(m: re.Match) -> str:
        n = int(m.group(1))
        if n < 1 or n > len(passages):
            return m.group(0)
        p     = passages[n - 1]
        url   = f"{base}/{p['zim_name']}/{p['article_path']}"
        label = p.get("title") or p["article_path"].rsplit("/", 1)[-1].replace("_", " ")
        return f"[[{n}: {label}]]({url})"

    return re.sub(r"\\[(\\d+)\\]", _replace, text)`

const ALLARKIVE_BATCH_EMBED = `async def _embed_batch(
    texts: list[str], client: httpx.AsyncClient, url: str, model: str
) -> list[list[float]]:
    """v0.2: send all chunk texts in one /api/embed request.
    v0.1 sent one request per chunk — 10–30× slower on CPU.
    Falls back to per-item serial requests on error."""
    r = await client.post(
        f"{url}/api/embed",
        json={"model": model, "input": texts},  # plural input list
        timeout=300.0,
    )
    r.raise_for_status()
    return r.json().get("embeddings")  # one embedding per text`

const ALLARKIVE_QUANT = `def pack(v: Iterable[float], mode: str) -> bytes:
    """Pack a unit-normalised vector to sqlite-vec wire bytes.

    float32: 4 bytes/dim — 768-dim model = 3,072 B per chunk
    int8:    1 byte/dim  — 768-dim model =   768 B per chunk  ← default
    Sub-1-point MTEB recall drop on cosine-normalised models.
    """
    vlist = list(v)
    if mode == "float32":
        return struct.pack(f"{len(vlist)}f", *vlist)
    if mode == "int8":
        # Map [-1, 1] → [-127, 127]
        ints = [max(-127, min(127, int(round(x * 127)))) for x in vlist]
        return struct.pack(f"{len(ints)}b", *ints)
    raise ValueError(f"unsupported quantization mode: {mode}")`

const ALLARKIVE_COMPOSE = `services:
  kiwix:       # Layer 1 — Archive  (ZIM server, bound to :8081)
  ollama:      # Layer 2a — AI      (Qwen 2.5 inference, :11434)
  open-webui:  # Layer 2b — UI      (chat interface, :3000)
  rag:         # Layer 2c — Glue    (FastAPI RAG pipeline, :8000)
  landing:     # Layer 3 — Portal   (nginx landing page, :8080)

# Open WebUI is wired via OPENAI_API_BASE_URLS.
# AllArkive appears as "allarkive-rag" in the model picker.
# Any OpenAI-compatible client works for free with zero integration code.
open-webui:
  environment:
    - OPENAI_API_BASE_URLS=http://rag:8000/v1
    - OPENAI_API_KEYS=\${RAG_API_KEY:-allarkive}
    - ANONYMIZED_TELEMETRY=false
    - DO_NOT_TRACK=1
    - SCARF_NO_ANALYTICS=true`

const ALLARKIVE_BOOTSTRAP = `# Clone and run one command.
# The script detects your platform, checks disk space, fetches the bundle,
# starts the stack, pulls the AI model, and prints a status summary.
git clone https://github.com/clupai8o0/allarkive && cd allarkive

scripts/bootstrap.sh                         # balanced bundle (~24 GB)
scripts/bootstrap.sh --bundle minimal --pi   # minimal (~5 GB) on Raspberry Pi
scripts/bootstrap.sh --bundle comprehensive \\
  --zim-dir /Volumes/SSD/zim                # comprehensive (~411 GB) on external disk`

export const POSTS: Post[] = [
  {
    slug: 'cryptography-and-blockchain',
    title: 'Cryptography and blockchain — from hash functions to 51% attacks',
    date: '2026-05-12',
    readMin: 22,
    tags: ['cryptography', 'blockchain', 'sha-256', 'math'],
    excerpt:
      'Cryptography from first principles, SHA-256 walked through gate by gate, Merkle trees, ECDSA, proof of work, and the mathematics behind why a 51% attack is technically possible and economically absurd.',
    featured: true,
    content: [
      {
        type: 'paragraph',
        dropCap: true,
        html:
          'I set out to explain blockchain end-to-end, but mean it — simple in shape, brutal in scope. Not "blocks are linked by hashes" hand-waving. Show the modular arithmetic. Walk SHA-256. Justify why ECDSA works. Put numbers on the 51% attack. What follows is that writeup, restructured as a long-form blog post.',
      },
      { type: 'heading', level: 2, text: 'Cryptography fundamentals' },
      {
        type: 'paragraph',
        html:
          'Cryptography is the science of moving data across an untrusted channel in a form that, even if intercepted, can\'t be read by an unauthorized party. The field is ancient — Egyptian hieroglyphics, Greek scytale, Caesar\'s cipher — but the modern shape of it is mathematical. Everything reduces to the same loop: <em>plaintext → encryption algorithm → ciphertext → decryption → plaintext</em>. Plaintext is what you want to send. Ciphertext is the unreadable form on the wire. Encryption is the forward direction; decryption is its inverse; both are governed by keys, and only the right key reverses the operation.',
      },
      {
        type: 'code',
        lang: 'makefile',
        code: 'Plaintext:  HELLO\nEncrypted:  KHOOR\nDecrypted:  HELLO',
        label: 'Caesar cipher — shift of 3',
      },
      {
        type: 'paragraph',
        html:
          'Underneath everything, cryptography is trying to guarantee four properties:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '<strong>Confidentiality.</strong> Private data stays unreadable to third parties.',
          '<strong>Integrity.</strong> Data hasn\'t been tampered with in transit or at rest.',
          '<strong>Authenticity.</strong> The sender is who they claim to be.',
          '<strong>Non-repudiation.</strong> A signer can\'t plausibly deny their signature.',
        ],
      },
      { type: 'heading', level: 3, text: 'Symmetric vs. asymmetric' },
      {
        type: 'paragraph',
        html:
          'There are two encryption families, and the distinction lives in the relationship between the encryption and decryption keys.',
      },
      {
        type: 'paragraph',
        html:
          '<strong>Symmetric encryption</strong> — one shared key for both sides. AES and DES are the canonical examples. The pain is key distribution: a company of <em>n</em> employees needs <em>n</em>(<em>n</em>−1)/2 keys to fully connect (≈ 499,500 for a thousand people), and every key has to be exchanged over a secure side-channel before any real traffic can flow.',
      },
      {
        type: 'paragraph',
        html:
          '<strong>Asymmetric encryption</strong> — two mathematically-linked keys: a public one anyone can hold, a private one that never leaves the owner. RSA and Elliptic Curve Cryptography are the workhorses. If Alice wants to send Bob a message, she encrypts with Bob\'s public key; only Bob\'s private key can decrypt. The private key is never transmitted, which is the entire point.',
      },
      { type: 'heading', level: 2, text: 'What blockchain actually is' },
      {
        type: 'paragraph',
        html:
          'A blockchain is a growing chain of records — each record a "block," each block linked to the previous one by a cryptographic hash. Distributed, decentralized, and immutable: distributed because copies live across many nodes, decentralized because no single node owns it, and immutable because changing one block invalidates every block after it.',
      },
      {
        type: 'paragraph',
        html:
          'Bitcoin and Ethereum are the visible faces, but the mechanism itself is just "a tamper-evident ledger anyone can verify." Each block carries a small bundle of fields:',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '<strong>Version</strong> — chain protocol version.',
          '<strong>Data</strong> — transactions, or any arbitrary payload.',
          '<strong>Previous hash</strong> — SHA-256 of the previous block. This is the "chain" part.',
          '<strong>Hash</strong> — SHA-256 of this block\'s contents. The block\'s fingerprint.',
          '<strong>Difficulty target</strong> — upper bound the block hash must come in under.',
          '<strong>Timestamp</strong> — when the block was created.',
          '<strong>Nonce</strong> — the number miners increment to brute-force a valid hash.',
        ],
      },
      {
        type: 'paragraph',
        html:
          'Two more rules turn this from a fancy linked list into something secure. <strong>Consensus</strong>: a block isn\'t added until the network agrees, which in Bitcoin\'s case means Proof of Work — miners race to find a nonce that drives the block hash below the difficulty target. <strong>Peer-to-peer replication</strong>: every node stores its own copy and validates every chain it sees. No node is authoritative; the longest valid chain wins.',
      },
      { type: 'heading', level: 2, text: 'Hash functions' },
      {
        type: 'paragraph',
        html:
          'A cryptographic hash function <em>H</em> takes an input of any length and produces an output of fixed length. Formally:',
      },
      { type: 'equation', html: 'H : {0,1}<sup>*</sup> → {0,1}<sup>n</sup>' },
      {
        type: 'paragraph',
        html:
          'Input <em>x</em> can be any binary string; output <em>H</em>(<em>x</em>) is exactly <em>n</em> bits. For SHA-256, <em>n</em> = 256. The properties that make hash functions useful for blockchain:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '<strong>Deterministic.</strong> Same input, same output, every time.',
          '<strong>Fixed-length output.</strong> 256-bit input or 256-megabyte input — same digest size.',
          '<strong>Pre-image resistance.</strong> Given <em>H</em>(<em>x</em>), it\'s computationally infeasible to recover <em>x</em>.',
          '<strong>Avalanche effect.</strong> A one-bit input change flips ≈ half the output bits.',
          '<strong>Collision resistance.</strong> No two inputs should produce the same hash.',
          '<strong>Efficient.</strong> Compute fast, even on enormous inputs.',
        ],
      },
      { type: 'heading', level: 3, text: 'MD5, SHA-1, SHA-256' },
      {
        type: 'paragraph',
        html:
          'Three families dominate the history of cryptographic hashing, and only one is still standing.',
      },
      {
        type: 'paragraph',
        html:
          '<strong>MD5.</strong> Ron Rivest, 128-bit output, broken by collision attacks. Don\'t use for anything cryptographic.',
      },
      {
        type: 'code',
        code: 'Text:  Hello World\nHash:  65a8e27d8879283831b664bd8b7f0ad4',
      },
      {
        type: 'paragraph',
        html:
          '<strong>SHA-1.</strong> NSA-designed, 160-bit output. Still appears in Git and legacy SSL but cryptographically retired after Google\'s 2017 SHAttered collision.',
      },
      {
        type: 'code',
        code: 'Text:  Hello World\nHash:  943a702d06f34599aee1f8da8ef9f7296031d699',
      },
      {
        type: 'paragraph',
        html:
          '<strong>SHA-256.</strong> SHA-2 family, 256-bit output, the basis of Bitcoin\'s Proof of Work and most modern digital signatures. No practical attacks; the wide hash space and strong avalanche make brute-force the only known approach.',
      },
      {
        type: 'code',
        code: 'Text:  Hello World\nHash:  a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b53a48a42f7a34e6f',
      },
      {
        type: 'table',
        headers: ['Feature', 'MD5', 'SHA-1', 'SHA-256'],
        rows: [
          ['Hash size', '128 bits', '160 bits', '256 bits'],
          ['Security', 'Low', 'Moderate', 'High'],
          ['Collision resistance', 'Broken', 'Broken', 'Secure'],
          ['Common uses', 'Checksums', 'SSL, Git', 'Blockchain, signatures, TLS'],
          ['Status', 'Deprecated', 'Deprecated', 'Active'],
        ],
      },
      { type: 'heading', level: 2, text: 'Mathematical foundations' },
      {
        type: 'paragraph',
        html:
          'To follow SHA-256 you need a small grab-bag of primitives. None of them is deep on its own; what makes the algorithm hard to reason about is how many of them get stacked.',
      },
      { type: 'heading', level: 3, text: 'Modular arithmetic' },
      {
        type: 'paragraph',
        html:
          'Modular arithmetic is "clock arithmetic" — numbers wrap around a fixed modulus. For integers <em>a</em> and <em>n</em>, the expression <em>a</em> mod <em>n</em> is the remainder of <em>a</em> ÷ <em>n</em>. So 7 mod 5 = 2.',
      },
      { type: 'equation', html: 'a mod n = r' },
      { type: 'heading', level: 3, text: 'Bitwise operations' },
      {
        type: 'paragraph',
        html:
          'SHA-256 lives in the world of 32-bit words. The six bitwise operations you need:',
      },
      {
        type: 'code',
        code: `AND (∧)            OR (∨)             XOR (⊕)
A    = 1101        A    = 1101        A    = 1101
B    = 1011        B    = 1011        B    = 1011
A&B  = 1001        A|B  = 1111        A⊕B  = 0110

NOT (¬)            SHL (<<)           SHR (>>)
A    = 1101        A<<2 = 110100      A>>2 = 0011
~A   = 0010`,
      },
      { type: 'heading', level: 3, text: 'Right rotation (ROTR)' },
      {
        type: 'paragraph',
        html:
          'Right rotation is "shift right, but wrap the bits that fall off back to the left so nothing is lost." For an <em>n</em>-bit number <em>x</em> rotated by <em>k</em>:',
      },
      { type: 'equation', html: 'ROTR(x, k) = (x ≫ k) ∨ (x ≪ (n − k))' },
      {
        type: 'paragraph',
        html:
          'Worked example with <em>A</em> = 11010011<sub>2</sub> and <em>k</em> = 3:',
      },
      {
        type: 'code',
        code: `ROTR(A, 3) = (A >> 3) | (A << 5)
           = 00011010 | 01100000
           = 01111010`,
      },
      { type: 'heading', level: 3, text: 'Boolean functions' },
      {
        type: 'paragraph',
        html:
          'Two mixing functions appear inside the SHA-256 compression round.',
      },
      {
        type: 'paragraph',
        html:
          '<strong>Choice</strong> — selects between <em>y</em> and <em>z</em> based on <em>x</em>:',
      },
      { type: 'equation', html: 'Ch(x, y, z) = (x ∧ y) ⊕ (¬x ∧ z)' },
      {
        type: 'paragraph',
        html:
          '<strong>Majority</strong> — returns whichever value occurs at least twice:',
      },
      { type: 'equation', html: 'Maj(x, y, z) = (x ∧ y) ⊕ (x ∧ z) ⊕ (y ∧ z)' },
      { type: 'heading', level: 3, text: 'Sigma functions' },
      {
        type: 'paragraph',
        html:
          'These four functions provide the diffusion that makes SHA-256\'s avalanche effect work — each one spreads input bits across the output by combining rotations at different offsets.',
      },
      { type: 'equation', html: 'Σ<sub>0</sub>(x) = ROTR(x, 2)  ⊕ ROTR(x, 13) ⊕ ROTR(x, 22)' },
      { type: 'equation', html: 'Σ<sub>1</sub>(x) = ROTR(x, 6)  ⊕ ROTR(x, 11) ⊕ ROTR(x, 25)' },
      { type: 'equation', html: 'σ<sub>0</sub>(x) = ROTR(x, 7)  ⊕ ROTR(x, 18) ⊕ (x ≫ 3)' },
      { type: 'equation', html: 'σ<sub>1</sub>(x) = ROTR(x, 17) ⊕ ROTR(x, 19) ⊕ (x ≫ 10)' },
      { type: 'heading', level: 2, text: 'SHA-256, walked' },
      {
        type: 'paragraph',
        html:
          'SHA-256 turns an arbitrary-length message <em>M</em> into a 256-bit digest through padding, splitting, expansion, compression, and a final addition. Four stages.',
      },
      { type: 'heading', level: 3, text: '1. Padding' },
      {
        type: 'paragraph',
        html:
          'First the message is padded so its total length is a multiple of 512 bits. The recipe is: append a single 1 bit, then enough 0 bits, then a 64-bit big-endian representation of the original length <em>L</em>:',
      },
      { type: 'equation', html: 'M\' = M ∥ 1 ∥ 0<sup>k</sup> ∥ Length(M),  with k = (448 − (L + 1)) mod 512' },
      { type: 'heading', level: 3, text: '2. Block splitting and message expansion' },
      {
        type: 'paragraph',
        html:
          'The padded message is split into 512-bit blocks. Each block is sliced into sixteen 32-bit words <em>W<sub>0</sub></em>…<em>W<sub>15</sub></em>, then extended to 64 words using a recurrence that mixes earlier words with σ<sub>0</sub> and σ<sub>1</sub>:',
      },
      { type: 'equation', html: 'W<sub>i</sub> = σ<sub>1</sub>(W<sub>i−2</sub>) + W<sub>i−7</sub> + σ<sub>0</sub>(W<sub>i−15</sub>) + W<sub>i−16</sub>  (mod 2<sup>32</sup>),  for i = 16…63' },
      { type: 'heading', level: 3, text: '3. Compression' },
      {
        type: 'paragraph',
        html:
          'Eight 32-bit state variables <em>a, b, c, d, e, f, g, h</em> are initialised from the SHA-256 constants:',
      },
      {
        type: 'code',
        code: `H0 = 0x6a09e667    H4 = 0x510e527f
H1 = 0xbb67ae85    H5 = 0x9b05688c
H2 = 0x3c6ef372    H6 = 0x1f83d9ab
H3 = 0xa54ff53a    H7 = 0x5be0cd19`,
      },
      {
        type: 'paragraph',
        html:
          'Each block runs 64 rounds. Every round mixes the state through Σ<sub>0</sub>, Σ<sub>1</sub>, Ch, Maj, the expanded word <em>W<sub>t</sub></em>, and a per-round constant <em>K<sub>t</sub></em>:',
      },
      { type: 'code', code: SHA_ROUND },
      { type: 'heading', level: 3, text: '4. Final hash' },
      {
        type: 'paragraph',
        html:
          'After the last block, the working state is added (mod 2<sup>32</sup>) back into the running hash, and the eight 32-bit words are concatenated to form the 256-bit digest:',
      },
      { type: 'equation', html: 'Hash = H<sub>0</sub> ∥ H<sub>1</sub> ∥ H<sub>2</sub> ∥ H<sub>3</sub> ∥ H<sub>4</sub> ∥ H<sub>5</sub> ∥ H<sub>6</sub> ∥ H<sub>7</sub>' },
      { type: 'heading', level: 3, text: 'Worked example — a Bitcoin block header' },
      {
        type: 'paragraph',
        html:
          'A real Bitcoin block header with plausible fields:',
      },
      {
        type: 'table',
        headers: ['Field', 'Example value'],
        rows: [
          ['Version', '0x20000000'],
          ['Previous block hash', '0000…3667d652b'],
          ['Merkle root', '871714dc…8e3f89e6'],
          ['Timestamp', '0x5B8D80C0'],
          ['Difficulty target', '0x17148EDF'],
          ['Nonce', '0x1dac2b7c'],
        ],
      },
      {
        type: 'paragraph',
        html:
          'Concatenate the fields, run SHA-256 twice (Bitcoin double-hashes to protect against length-extension attacks), and compare against the target. If the resulting H<sub>2</sub> &lt; Target, the block is valid and the miner is paid.',
      },
      {
        type: 'code',
        code: `H1 = SHA256(header)
H2 = SHA256(H1)

# Block is mined if:
H2 < Target`,
      },
      {
        type: 'blockquote',
        html:
          'SHA-256 is the engine of every meaningful property a blockchain claims to have. Immutability, mining, transaction IDs, Merkle roots — all of them are one hash function applied carefully.',
      },
      { type: 'heading', level: 2, text: 'How blockchain uses hashes' },
      {
        type: 'paragraph',
        html:
          'In a blockchain, every block embeds the hash of the previous block in its own header. The link is not metadata — it\'s structural. Tamper with any block <em>B<sub>n</sub></em> and its hash changes (avalanche effect). But block <em>B<sub>n+1</sub></em> embedded the <em>old</em> hash, so the link breaks; <em>B<sub>n+1</sub></em>\'s hash now also fails to match what <em>B<sub>n+2</sub></em> embedded, and so on. The tamper cascades all the way to the chain head, and every node detects it instantly.',
      },
      { type: 'code', code: BLOCK_AND_BLOCK, label: 'a three-block chain (genesis → block 2)' },
      { type: 'heading', level: 2, text: 'Proof of Work' },
      {
        type: 'paragraph',
        html:
          'Proof of Work is Bitcoin\'s consensus mechanism. To add a block, a miner has to find a hash below a target value — and finding it requires enormous computational effort, while verifying it costs almost nothing.',
      },
      { type: 'equation', html: 'H(Block Header + Nonce) < Target' },
      {
        type: 'paragraph',
        html:
          'Difficulty <em>D</em> is inversely proportional to the target <em>T</em>:',
      },
      { type: 'equation', html: 'D = T<sub>max</sub> / T' },
      { type: 'heading', level: 3, text: 'The probability behind the puzzle' },
      {
        type: 'paragraph',
        html:
          'SHA-256 has 2<sup>256</sup> ≈ 1.16 × 10<sup>77</sup> possible outputs. The probability of any single hash being below the target is:',
      },
      { type: 'equation', html: 'P = T / 2<sup>256</sup>' },
      {
        type: 'paragraph',
        html:
          'Substituting <em>T</em> = <em>T<sub>max</sub></em> / <em>D</em>:',
      },
      { type: 'equation', html: 'P = T<sub>max</sub> / (D × 2<sup>256</sup>) = 1 / D' },
      {
        type: 'paragraph',
        html:
          'Which means the expected number of hash attempts to find a valid block is exactly the difficulty:',
      },
      { type: 'equation', html: 'Attempts = 1 / P = D' },
      {
        type: 'paragraph',
        html:
          'Bitcoin readjusts difficulty every 2,016 blocks so the average block time stays near 10 minutes:',
      },
      { type: 'equation', html: 'D<sub>new</sub> = D<sub>old</sub> × (T<sub>actual</sub> / T<sub>target</sub>)' },
      {
        type: 'paragraph',
        html:
          'When miners get faster on aggregate, difficulty climbs and the puzzle gets harder. The block time is the regulator; everything else is a knob the network turns to keep it steady.',
      },
      { type: 'heading', level: 2, text: 'Merkle trees' },
      {
        type: 'paragraph',
        html:
          'A block can contain thousands of transactions; you don\'t want to re-hash all of them every time you verify one. Merkle trees solve this. Each transaction is hashed into a leaf, leaves are hashed pairwise into parents, parents are hashed into grandparents, and at the top of the tree sits a single hash — the <strong>Merkle root</strong> — that compresses every transaction in the block into 256 bits.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Each transaction <em>T<sub>i</sub></em> becomes a leaf <em>L<sub>i</sub></em> = <em>H</em>(<em>T<sub>i</sub></em>).',
          'Pairs of leaves are concatenated and hashed: <em>P<sub>i</sub></em> = <em>H</em>(<em>L<sub>i</sub></em> ∥ <em>L<sub>i+1</sub></em>).',
          'Pairs of parents are hashed again, recursively, until one root remains.',
        ],
      },
      {
        type: 'image',
        src: '/writing/blockchain/merkle-tree.png',
        alt: 'Merkle tree with four transactions hashing pairwise into a single root',
        caption: 'A four-transaction Merkle tree. The root is the single hash that summarises the entire block.',
        lightBg: true,
      },
      {
        type: 'paragraph',
        html:
          'To verify that <em>T<sub>1</sub></em> is in the block, a verifier only needs <em>L<sub>2</sub></em> and <em>P<sub>2</sub></em> — log<sub>2</sub>(n) hashes instead of all <em>n</em>. That logarithmic verification cost is what makes lightweight clients (SPV wallets) possible.',
      },
      { type: 'equation', html: 'Merkle root = H( H(L<sub>1</sub> ∥ L<sub>2</sub>) ∥ P<sub>2</sub> )' },
      { type: 'heading', level: 2, text: 'Security of the hash itself' },
      {
        type: 'paragraph',
        html:
          'SHA-256 needs to resist two specific attacks for blockchain to mean anything.',
      },
      { type: 'heading', level: 3, text: 'Pre-image resistance' },
      {
        type: 'paragraph',
        html:
          'Given a hash <em>y</em>, finding any <em>x</em> with <em>H</em>(<em>x</em>) = <em>y</em> takes O(2<sup>256</sup>) operations on average. At 1,000 hashes per second:',
      },
      { type: 'equation', html: 'Time = 2<sup>256</sup> / 10<sup>3</sup> ≈ 1.16 × 10<sup>74</sup> s ≈ 3.67 × 10<sup>66</sup> years' },
      {
        type: 'paragraph',
        html:
          'The age of the universe is ≈ 1.4 × 10<sup>10</sup> years. The brute-force bound isn\'t large; it\'s laughable.',
      },
      { type: 'heading', level: 3, text: 'Collision resistance' },
      {
        type: 'paragraph',
        html:
          'Finding any two inputs that hash to the same output is easier than pre-image, thanks to the birthday paradox — but only down to:',
      },
      { type: 'equation', html: '√(2<sup>256</sup>) = 2<sup>128</sup>' },
      {
        type: 'paragraph',
        html:
          'Still infeasible. 2<sup>128</sup> ≈ 3.4 × 10<sup>38</sup>, which exceeds the total computational work the human species has ever performed by many orders of magnitude.',
      },
      {
        type: 'table',
        headers: ['Attack', 'Complexity', 'Why it fails'],
        rows: [
          ['Pre-image', 'O(2^256)', 'Hash space is astronomical; brute force is the only known approach.'],
          ['Collision', 'O(2^128)', 'Birthday paradox halves the exponent but the bound is still beyond reach.'],
        ],
      },
      { type: 'heading', level: 2, text: 'Digital signatures and ECDSA' },
      {
        type: 'paragraph',
        html:
          'Signatures answer a different question to hashing: not "has this been tampered with," but "who authorised it." In blockchain, every transaction is signed by its sender\'s private key, and anyone holding the matching public key can verify it without ever seeing the private key. The sender can\'t plausibly deny the signature — non-repudiation — and the verifier can\'t forge one because they\'d need the private key to do it.',
      },
      { type: 'equation', html: 'Sign: S = Encrypt( H(M), d )       Verify: H(M) = Decrypt( S, e )' },
      {
        type: 'paragraph',
        html:
          'Where <em>d</em> is the private key, <em>e</em> is the public key, and <em>M</em> is the message. If the decrypted signature matches the message hash, the signature is genuine.',
      },
      { type: 'heading', level: 3, text: 'Elliptic curve cryptography' },
      {
        type: 'paragraph',
        html:
          'RSA works, but ECC gives equivalent security at much smaller key sizes — which matters when you\'re storing keys on every transaction in a public ledger. ECC is built on the algebra of points on an elliptic curve over a finite field 𝔽<sub>p</sub>:',
      },
      { type: 'equation', html: 'y² = x³ + ax + b  (mod p),   with  4a³ + 27b² ≠ 0' },
      {
        type: 'paragraph',
        html:
          'The discriminant condition keeps the curve non-singular. The two operations you do on curve points are <strong>addition</strong> and <strong>scalar multiplication</strong>. Adding two distinct points <em>P</em>(<em>x</em><sub>1</sub>, <em>y</em><sub>1</sub>) and <em>Q</em>(<em>x</em><sub>2</sub>, <em>y</em><sub>2</sub>) uses the slope between them:',
      },
      { type: 'equation', html: 'λ = (y<sub>2</sub> − y<sub>1</sub>) / (x<sub>2</sub> − x<sub>1</sub>)  (mod p)' },
      { type: 'equation', html: 'x<sub>3</sub> = λ² − x<sub>1</sub> − x<sub>2</sub>,   y<sub>3</sub> = λ(x<sub>1</sub> − x<sub>3</sub>) − y<sub>1</sub>  (mod p)' },
      {
        type: 'paragraph',
        html:
          'Scalar multiplication is then just repeated addition: <em>kP</em> means "add <em>P</em> to itself <em>k</em> times." Computing <em>kP</em> is fast. Reversing it — recovering <em>k</em> given <em>P</em> and <em>kP</em> — is the <strong>Elliptic Curve Discrete Logarithm Problem (ECDLP)</strong>, and the best known algorithm runs in O(√<em>n</em>) time. For curves with <em>n</em> ≈ 2<sup>256</sup>, that\'s 2<sup>128</sup> operations: the same wall we hit for hash collisions.',
      },
      { type: 'heading', level: 3, text: 'ECDSA — signing a transaction' },
      {
        type: 'paragraph',
        html:
          'ECDSA is the digital signature scheme Bitcoin and Ethereum actually use. To sign a message <em>M</em> with private key <em>d</em>:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Hash the message: <em>H</em>(<em>M</em>) = SHA256(<em>M</em>).',
          'Pick a one-time secret random nonce <em>k</em>.',
          'Compute the curve point (<em>x</em>, <em>y</em>) = <em>k</em> · <em>G</em>, where <em>G</em> is the curve\'s base point. Set <em>r</em> = <em>x</em> mod <em>n</em>.',
          'Compute <em>s</em> = <em>k</em><sup>−1</sup> · ( <em>H</em>(<em>M</em>) + <em>r</em> · <em>d</em> ) mod <em>n</em>.',
          'Publish the signature (<em>r</em>, <em>s</em>).',
        ],
      },
      {
        type: 'paragraph',
        html:
          'Verification reverses the process using the signer\'s public key <em>P</em> = <em>d</em> · <em>G</em>:',
      },
      { type: 'equation', html: 'u<sub>1</sub> = s<sup>−1</sup> · H(M)  (mod n),    u<sub>2</sub> = s<sup>−1</sup> · r  (mod n)' },
      { type: 'equation', html: '(x\', y\') = u<sub>1</sub> · G + u<sub>2</sub> · P,   accept if r ≡ x\' (mod n)' },
      {
        type: 'paragraph',
        html:
          'The nonce <em>k</em> has to be both fresh and secret. Reusing it across two signatures leaks the private key — this is exactly how Sony\'s PS3 signing key was extracted in 2010. Every "ECDSA postmortem" article ever written is, in the end, about <em>k</em>.',
      },
      { type: 'heading', level: 2, text: 'Blockchain security in aggregate' },
      {
        type: 'paragraph',
        html:
          'Every block <em>B<sub>n</sub></em> can be written as a hash of three things — its data, the hash of the previous block, and its nonce:',
      },
      { type: 'equation', html: 'B<sub>n</sub> = H( D<sub>n</sub> ∥ H(B<sub>n−1</sub>) ∥ N<sub>n</sub> )' },
      {
        type: 'paragraph',
        html:
          'Change any single <em>D<sub>n</sub></em> and the avalanche effect ensures the new <em>B<sub>n</sub></em>′ ≠ <em>B<sub>n</sub></em>. Block <em>B<sub>n+1</sub></em> embedded the old hash, so its hash also changes when you re-derive it with the new previous-hash field, and the ripple continues all the way to the chain head. Tamper detection is mechanical, not heuristic.',
      },
      { type: 'heading', level: 3, text: 'The 51% attack' },
      {
        type: 'paragraph',
        html:
          'The textbook attack on Proof of Work is the 51% attack: an adversary controlling a majority of the network\'s hash rate can mine a competing chain faster than honest miners, eventually overtaking the canonical chain and rewriting history. The math admits this — the attacker\'s probability of catching up grows with the fraction of hashpower they hold:',
      },
      { type: 'equation', html: 'P<sub>success</sub> = ( p / (1 − p) )<sup>n</sup>' },
      {
        type: 'paragraph',
        html:
          'For <em>p</em> = 0.51 this is (1.0408)<sup>n</sup>, which trends to 1 as <em>n</em> grows. But the cost grows with it. Re-mining <em>n</em> blocks against the network\'s combined hashpower requires roughly:',
      },
      { type: 'equation', html: 'C<sub>attack</sub> = ( H<sub>attack</sub> / H<sub>total</sub> ) · C<sub>hash</sub> · n' },
      {
        type: 'paragraph',
        html:
          'For Bitcoin in 2024, that\'s on the order of billions of US dollars per day of sustained majority hashpower, plus the hardware required to produce it, plus the electricity. And the reward — being able to double-spend, briefly — is bounded by the size of the transactions you can reverse before the network notices. The attack is mathematically feasible and economically nonsensical, which is the entire design.',
      },
      { type: 'heading', level: 2, text: 'Reflection' },
      {
        type: 'paragraph',
        html:
          'Two things stood out writing this. The first is how much of blockchain\'s security reduces to "SHA-256 doesn\'t leak structure and ECDLP has no shortcut." Take either of those away and the rest of the building falls. The second is how cleanly the economic and the cryptographic layers compose. The math says a 51% attack is possible; the economics says it isn\'t worth it; together they say the system is secure. Neither half is sufficient on its own, and pretending otherwise — "blockchain is unhackable" or "blockchain is fundamentally insecure" — misses the joint argument that\'s actually doing the work.',
      },
      { type: 'heading', level: 2, text: 'References' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Alman, S. & Hirsh, S. (2020). <em>Blockchain</em>. ALA Neal-Schuman.',
          'Laurence, T. (2023). <em>Blockchain for Dummies</em>.',
          'Shen, M., Zhu, L. & Xu, K. (2020). <em>Blockchain: Empowering Secure Data Sharing</em>. Springer.',
          'Mammeri, Z. (2024). <em>Cryptography: Algorithms, Protocols, and Standards for Computer Security</em>. Wiley.',
          'Buterin, V. (2017). <em>The Meaning of Decentralization</em>. Medium.',
          'Konstantopoulos, G. (2017). <em>Understanding Blockchain Fundamentals, Part 1: Byzantine Fault Tolerance</em>. Loom Network.',
          'Castor, A. (2017). <em>A (Short) Guide to Blockchain Consensus Protocols</em>. CoinDesk.',
          'Nakamoto, S. (2008). <em>Bitcoin: A Peer-to-Peer Electronic Cash System</em>.',
        ],
      },
    ],
  },
  {
    slug: 'secure-tls-chat-in-python',
    title: 'Building a secure chat in Python, with TLS the whole way down',
    date: '2026-05-12',
    readMin: 12,
    tags: ['networking', 'cryptography', 'python'],
    excerpt:
      'A threaded TCP chat with mutual TLS, self-signed certs minted in Python, the handshake walked through end to end, and an honest list of the security properties this thing does and does not give you.',
    featured: true,
    content: [
      {
        type: 'paragraph',
        dropCap: true,
        html:
          'This is the project where TLS finally stopped feeling like a magic incantation. The goal was a chat application in Python with encrypted communication. I could have wrapped <code>socket.socket</code> in <code>ssl.wrap_socket</code> and called it done. Instead I built it from the cert generator up, watched the handshake in Wireshark, and wrote down which flags I was setting and which defaults I was trusting. What follows is the same writeup, restructured for a blog: walkthrough first, code second, threat model third.',
      },
      { type: 'heading', level: 2, text: 'What I was trying to learn' },
      {
        type: 'paragraph',
        html:
          'The learning objectives were the usual mix: how TLS secures client-server traffic, how to set up SSL certificates in Python, how to implement and test a TLS-secured chat with <code>socket</code> and <code>ssl</code>, how to analyse encrypted traffic in Wireshark, and how to be honest about the limits of a base TLS implementation. The personal goal underneath that was simpler — to be able to defend every line of code I wrote.',
      },
      { type: 'heading', level: 2, text: 'Why TLS, briefly' },
      {
        type: 'paragraph',
        html:
          'TLS — Transport Layer Security — is a cryptographic protocol designed to provide encryption over a network. It combines an asymmetric handshake (where client and server exchange information and verify each other\'s certificates) with a symmetric session cipher (where the actual traffic is encrypted using a shared secret derived from that handshake). The result is confidentiality, integrity, and authentication on a channel that\'s otherwise just bytes on a wire.',
      },
      {
        type: 'paragraph',
        html:
          'TLS replaced SSL — Secure Sockets Layer — which had accumulated enough vulnerabilities by the late 1990s that it\'s now deprecated. The Python module is still called <code>ssl</code> for historical reasons, but the protocol it speaks today is TLS.',
      },
      {
        type: 'video',
        href: 'https://youtu.be/f5zFw34LwXE',
        label: 'TCP handshake — intro walkthrough',
      },
      {
        type: 'image',
        src: '/writing/secure-tls-chat/tls-handshake-part1.png',
        alt: 'TCP handshake and TLS certificate check flow diagram',
        caption: 'Part 1 — TCP handshake into TLS Client Hello and certificate check (asymmetric).',
        lightBg: true,
      },
      {
        type: 'image',
        src: '/writing/secure-tls-chat/tls-handshake-part2.png',
        alt: 'TLS key exchange and data transmission flow diagram',
        caption: 'Part 2 — key exchange, change cipher spec, and the symmetric data phase.',
        lightBg: true,
      },
      { type: 'heading', level: 2, text: 'Project shape' },
      {
        type: 'paragraph',
        html:
          'The deliverable is a client-server chat where the server listens for TLS connections and each client opens its own secure socket. Once the handshake completes, both sides exchange messages encrypted with a session key negotiated during the handshake. The server fans messages out to every other connected client. Architecturally: nothing exotic — a threaded TCP server with TLS bolted on, and a thin client that runs two threads (one for stdin, one for the socket).',
      },
      {
        type: 'paragraph',
        html:
          'The full source — <code>generate_certs.py</code>, <code>server.py</code>, <code>client.py</code> — lives on <a href="https://github.com/Clupai8o0/sit202-3.2h" target="_blank" rel="noopener noreferrer">GitHub</a>. The walkthrough below is the same shape as my original writeup: certs, then server, then client, then a run.',
      },
      {
        type: 'video',
        href: 'https://youtu.be/cLlYvoGzl-0',
        label: 'Project introduction demo',
      },
      { type: 'heading', level: 2, text: 'Generating self-signed certificates' },
      {
        type: 'paragraph',
        html:
          'In a TLS session, certificates do two jobs: they carry a public key, and they let the other side verify the identity bound to that key. The matching private key never leaves the endpoint it belongs to. That asymmetry is what stops a man-in-the-middle from impersonating either side — they can intercept the bytes, but they can\'t produce a certificate either party will accept without also holding the matching private key.',
      },
      {
        type: 'paragraph',
        html:
          'In production, certificates are issued by a Certificate Authority — Let\'s Encrypt, an internal PKI, anyone whose root is already in your trust store. For a local project that lives entirely on <code>localhost</code>, I generate them myself. Both endpoints are the issuer; both endpoints manually trust the other\'s cert. The trust boundary is my laptop, and that\'s acceptable for what this is.',
      },
      {
        type: 'paragraph',
        html:
          'I wrote <code>generate_certs.py</code> using the <code>cryptography</code> package because <code>openssl</code> hides too much of the structure. I wanted every field of the X.509 certificate to be a line I wrote.',
      },
      { type: 'heading', level: 3, text: '1. Imports' },
      { type: 'code', lang: 'python', code: CERT_IMPORTS },
      { type: 'heading', level: 3, text: '2. Generate an RSA private key' },
      {
        type: 'paragraph',
        html:
          'RSA-2048 with the standard public exponent. The private key is what signs everything else and what the matching certificate makes claims about.',
      },
      { type: 'code', lang: 'python', code: CERT_PRIVATE_KEY },
      { type: 'heading', level: 3, text: '3. Derive the public key' },
      {
        type: 'paragraph',
        html:
          'The public key is derived from the private key; only the public key goes into the certificate. The private key stays on disk in <code>{prefix}.key</code> and is loaded by whichever process owns this identity.',
      },
      { type: 'code', lang: 'python', code: CERT_PUBLIC_KEY },
      { type: 'heading', level: 3, text: '4. Define the subject' },
      {
        type: 'paragraph',
        html:
          'The certificate\'s Common Name (CN) is <code>localhost</code> for the server and <code>client.localhost</code> for the client. CN-based identification is legacy; modern verification leans on the Subject Alternative Name extension we add in the next step. But it costs nothing to set both, and it makes the cert legible when you inspect it.',
      },
      { type: 'code', lang: 'python', code: CERT_SUBJECT },
      { type: 'heading', level: 3, text: '5. Build the X.509 certificate' },
      {
        type: 'paragraph',
        html:
          'Subject and issuer are the same — self-signed. Random serial number. Validity window of exactly one year. A <code>SubjectAlternativeName</code> extension pinning the cert to <code>localhost</code> as a DNS name. Finally, sign the whole thing with SHA-256 and the private key.',
      },
      { type: 'code', lang: 'python', code: CERT_BUILDER },
      { type: 'heading', level: 3, text: '6. Write the files' },
      {
        type: 'paragraph',
        html:
          'PEM format, unencrypted private key (acceptable for local dev, not for anywhere real), PKCS#8 encoding. After this runs, the working directory has <code>{prefix}.key</code> and <code>{prefix}.crt</code>.',
      },
      { type: 'code', lang: 'python', code: CERT_SAVE },
      { type: 'heading', level: 3, text: '7. Generate both identities' },
      {
        type: 'paragraph',
        html:
          'Call <code>generate_cert</code> twice — once for the server, once for the client. End result: four files in the working directory.',
      },
      { type: 'code', lang: 'python', code: CERT_INVOKE },
      {
        type: 'blockquote',
        html:
          'A self-signed certificate isn\'t insecure. It\'s insecure <em>by default</em>, because the system trust store doesn\'t know it. The moment you explicitly load it as a trust anchor on the other side, it\'s exactly as trustworthy as the channel you used to ship it.',
      },
      {
        type: 'video',
        href: 'https://youtu.be/pAb3NZET1VY',
        label: 'generate_certs.py — script demo',
      },
      { type: 'heading', level: 2, text: 'The server' },
      {
        type: 'paragraph',
        html:
          '<code>server.py</code> is the heart of the application. It binds a TCP socket, configures an SSL context, accepts connections, upgrades each one to TLS, and fans messages out to every other connected client. Threaded, one thread per client.',
      },
      { type: 'heading', level: 3, text: 'Imports' },
      { type: 'code', lang: 'python', code: SERVER_IMPORTS },
      { type: 'heading', level: 3, text: 'Socket and SSL context' },
      {
        type: 'paragraph',
        html:
          'Standard TCP socket, <code>SO_REUSEADDR</code> so I don\'t have to wait for the kernel to release the port between runs, <code>bind</code>, <code>listen</code>. None of that is TLS yet. The SSL context is where the security posture is set: <code>Purpose.CLIENT_AUTH</code> picks server-side defaults, <code>verify_mode = CERT_REQUIRED</code> forces mutual TLS, <code>load_cert_chain</code> gives the server its identity, <code>load_verify_locations</code> tells it which client certificates to trust.',
      },
      { type: 'code', lang: 'python', code: SERVER_SOCKET_AND_CTX },
      { type: 'heading', level: 3, text: 'Accept and wrap' },
      {
        type: 'paragraph',
        html:
          'Each accepted socket is wrapped with <code>wrap_socket(..., server_side=True)</code> inside its worker thread, not before it. The TLS handshake blocks; if I wrapped on the accept loop\'s thread, a slow client could stall every other handshake. Pushing the wrap into the worker isolates that cost.',
      },
      { type: 'code', lang: 'python', code: SERVER_ACCEPT_WRAP },
      { type: 'heading', level: 3, text: 'Threading' },
      {
        type: 'paragraph',
        html:
          'Daemon threads so they die with the process. Each thread owns its socket end-to-end.',
      },
      { type: 'code', lang: 'python', code: SERVER_THREAD },
      { type: 'heading', level: 3, text: 'Receive and broadcast' },
      {
        type: 'paragraph',
        html:
          'Inside the worker, read 1024 bytes at a time. Decode. Timestamp. Re-encode and send to every other socket in the list. The CPython GIL is doing some of the heavy lifting here — <code>list.append</code> and <code>list.remove</code> are atomic in CPython on a single list — so I didn\'t reach for a lock. Worth noting as a thing I\'d revisit if this were anything more than a demo.',
      },
      { type: 'code', lang: 'python', code: SERVER_RECV_BROADCAST },
      { type: 'heading', level: 3, text: 'Logging' },
      {
        type: 'paragraph',
        html:
          '<code>INFO</code>-level logging with timestamps. Every new connection, every disconnection, every broadcast. When something breaks at the handshake layer, this is the only window into what happened.',
      },
      { type: 'code', lang: 'python', code: SERVER_LOGGING },
      {
        type: 'video',
        href: 'https://youtu.be/qWO7P5EdGC8',
        label: 'server.py — overview',
      },
      { type: 'heading', level: 2, text: 'The client' },
      {
        type: 'paragraph',
        html:
          '<code>client.py</code> is the mirror image of the server: TCP socket, SSL context, wrap, connect, then two threads — one reads stdin and sends, one reads the socket and prints. There\'s one line I want to call out because it would be a real bug anywhere outside a local demo.',
      },
      { type: 'heading', level: 3, text: 'Setup and wrap' },
      { type: 'code', lang: 'python', code: CLIENT_SETUP },
      {
        type: 'paragraph',
        html:
          '<code>check_hostname = False</code> is the dangerous line. Hostname verification is what ties a certificate to the name you dialled — it stops "any cert in my trust store" from becoming "any host can present any of those certs and I\'ll believe them." I disabled it because the self-signed setup\'s CN matching gets fussy and this project isn\'t about debugging PKI. In production with a real CA, that line is deleted.',
      },
      { type: 'heading', level: 3, text: 'Connect' },
      { type: 'code', lang: 'python', code: CLIENT_CONNECT },
      { type: 'heading', level: 3, text: 'Send messages' },
      {
        type: 'paragraph',
        html:
          'Read from stdin, prepend the username, encode as UTF-8, send. There\'s no message framing — I lean on the fact that <code>send</code> calls are short and arrive intact under local-only load. TCP being a stream and not a message queue is a real bug waiting to happen, and I name it in the limitations section.',
      },
      { type: 'code', lang: 'python', code: CLIENT_SEND },
      { type: 'heading', level: 3, text: 'Receive messages' },
      {
        type: 'paragraph',
        html:
          'A second thread sits in a blocking <code>recv</code> loop. When a message lands, it prints it without clobbering the user\'s in-progress input — <code>\\r\\033[K</code> wipes the current line, the message gets printed, the <code>&gt; </code> prompt is re-emitted.',
      },
      { type: 'code', lang: 'python', code: CLIENT_RECV },
      {
        type: 'blockquote',
        html:
          'Every "for development only" flag is a future production bug waiting for someone to copy-paste it. Leaving the line with a visible comment is the honest move — silently turning safety off is the dishonest one.',
      },
      {
        type: 'video',
        href: 'https://youtu.be/xjBJmlwxrNE',
        label: 'client.py — overview',
      },
      { type: 'heading', level: 2, text: 'Running it' },
      {
        type: 'paragraph',
        html:
          'Three terminals. Cert generation first, then the server, then one or more clients.',
      },
      { type: 'code', lang: 'bash', code: '$ python generate_certs.py' },
      {
        type: 'paragraph',
        html: 'This drops <code>server.crt</code>, <code>server.key</code>, <code>client.crt</code>, and <code>client.key</code> in the working directory. Then the server:',
      },
      { type: 'code', lang: 'bash', code: '$ python server.py' },
      {
        type: 'paragraph',
        html:
          'You\'ll see logs for "Server listening on localhost:8443" and then nothing until a client connects. In separate terminals, run as many clients as you want:',
      },
      { type: 'code', lang: 'bash', code: '$ python client.py' },
      {
        type: 'paragraph',
        html:
          'Each client prompts for a username, broadcasts a join message, and then drops you into the chat. The server log shows each message being received, timestamped, and relayed; the clients see each other\'s messages in real time. The actual bytes on the wire — which I confirmed in Wireshark — are unintelligible to anyone tapping the connection.',
      },
      {
        type: 'video',
        href: 'https://youtu.be/g0JeM9Pj2U8',
        label: 'final demo — running everything with Wireshark capture',
      },
      { type: 'heading', level: 2, text: 'Threat model and limitations' },
      {
        type: 'paragraph',
        html:
          'TLS-encrypted communication and certificate-based authentication work as advertised here. What this project does <em>not</em> defend against is more interesting than what it does.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          '<strong>Hostname verification is disabled on the client.</strong> Any cert in the client\'s trust store can impersonate any server. Fine for localhost, indefensible in production.',
          '<strong>No user-level authentication.</strong> Any process that holds <code>client.key</code> can connect. There is no password, no second factor, no per-user identity beyond the certificate itself.',
          '<strong>Messages are not encrypted at rest.</strong> TLS protects the wire; it does nothing for logs, history, or local memory. A compromised endpoint leaks plaintext.',
          '<strong>No revocation.</strong> If a private key leaks, my only option is to reissue and redistribute. No CRL, no OCSP, no kill switch.',
          '<strong>No message framing.</strong> <code>recv(1024)</code> assumes one send produces one readable chunk. TCP doesn\'t guarantee that.',
          '<strong>No rate limiting.</strong> A misbehaving client can open many connections and burn through the server\'s thread budget.',
        ],
      },
      {
        type: 'table',
        headers: ['Limitation', 'Proposed fix'],
        rows: [
          ['Hostname verification disabled', 'Enable it; issue certs via a trusted internal CA'],
          ['No user authentication', 'Add a login layer (password + session token over TLS)'],
          ['No message encryption at rest', 'Encrypt logs; access-controlled secure backend'],
          ['Stream framing implicit', 'Length-prefix every message before send'],
          ['Threaded I/O bottleneck', 'Move to asyncio with ssl=True on streams'],
        ],
      },
      {
        type: 'paragraph',
        html:
          'I think being explicit about the second list is more useful than the first. Security gets marketed as a property you have or don\'t. In practice it\'s a set of specific properties against specific adversaries, and naming the ones you don\'t have is how you stop yourself accidentally claiming them.',
      },
      { type: 'heading', level: 2, text: 'Reflection' },
      {
        type: 'paragraph',
        html:
          'What this exercise gave me was a less mystical relationship with TLS. It\'s a state machine on top of a socket. The defaults are good. The places where you override them are exactly the places where you\'re taking responsibility for what "secure" means in your specific setup. The certificate is a file; the trust is a decision; the encryption is just math you chose to plug in.',
      },
      {
        type: 'paragraph',
        html:
          'About two hundred lines of Python all told. But each line is now one I\'d defend — which is more than I could have said before I wrote them.',
      },
      { type: 'heading', level: 2, text: 'Full source' },
      {
        type: 'paragraph',
        html:
          'For reference, the complete contents of all three files. Repo is on <a href="https://github.com/Clupai8o0/sit202-3.2h" target="_blank" rel="noopener noreferrer">GitHub</a>.',
      },
      { type: 'heading', level: 3, text: 'generate_certs.py' },
      { type: 'code', lang: 'python', code: FULL_GENERATE_CERTS },
      { type: 'heading', level: 3, text: 'server.py' },
      { type: 'code', lang: 'python', code: FULL_SERVER },
      { type: 'heading', level: 3, text: 'client.py' },
      { type: 'code', lang: 'python', code: FULL_CLIENT },
    ],
  },
  {
    slug: 'teaching-react-with-a-todo-app',
    title: 'Teaching React from zero, one Todo app at a time',
    date: '2026-05-12',
    readMin: 10,
    tags: ['react', 'teaching', 'frontend'],
    excerpt:
      'A workshop writeup. Two repos — one for setup, one for live coding — taking a room of first-time React users from a blank terminal to a deployed Todo app. Step-by-step, with the thinking I tried to teach behind every commit.',
    content: [
      {
        type: 'paragraph',
        dropCap: true,
        html:
          'I ran a React workshop for students who had never touched the framework. Two repos went out before the session: a <a href="https://github.com/Clupai8o0/react-portoflio-workshop-starting-guide" target="_blank" rel="noopener noreferrer">starting guide</a> for installing the tools, and a <a href="https://github.com/Clupai8o0/react-portoflio-workshop-live-coding" target="_blank" rel="noopener noreferrer">live-coding companion</a> that mirrored every step I would type on stream. This is the writeup of what we built and the calls I made along the way — not just <em>what</em> the code does, but the order I introduced it in and why.',
      },
      { type: 'heading', level: 2, text: 'The pedagogical bet' },
      {
        type: 'paragraph',
        html:
          'A Todo app is the most overused beginner project in frontend, and that is exactly why I picked it. Everyone in the room already had a mental model of what a Todo app should do, which meant I could spend the session on React instead of explaining the problem domain. The goal was never to teach Todo lists. It was to teach four ideas — components, props, state, lifting state up — by sneaking them past students one commit at a time.',
      },
      {
        type: 'paragraph',
        html:
          'The structure of the live-coding repo reflects that. Every step has a <strong>Live coding</strong> block (the incremental edit I type on screen) and a <strong>Snippet</strong> block (the full file you can copy-paste if you fell behind). Falling behind is the silent killer of code-along workshops. The snippets meant nobody had to ask me to scroll back.',
      },
      { type: 'heading', level: 2, text: 'Getting the room to "Hello, React"' },
      {
        type: 'paragraph',
        html:
          'Before any React happens, every laptop needs Node, a code editor, Git, and a GitHub account. I put this in a separate guide because mixing "install Node" with "useState lifts state up" in the same document is how you lose a beginner forever.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '<strong>Node.js (LTS)</strong> — the JavaScript runtime that powers every modern frontend build tool. Get the LTS, not the latest.',
          '<strong>Visual Studio Code</strong> — light, free, has a built-in terminal so I don\'t have to teach two windows at once.',
          '<strong>Git</strong> — version control, but on day one really just <code>git init</code> and <code>git push</code>.',
          '<strong>GitHub</strong> — a place to put the repo so we can deploy it on Netlify in the last ten minutes.',
        ],
      },
      {
        type: 'paragraph',
        html:
          'Three commands to confirm everything is wired up — <code>node -v</code>, <code>npm -v</code>, <code>git --version</code>. If any of them fails, the student is in <a href="https://replit.com/" target="_blank" rel="noopener noreferrer">Replit</a> for the rest of the session. The escape hatch matters. The workshop cannot wait for one person\'s PATH variable to cooperate.',
      },
      {
        type: 'blockquote',
        html:
          'In a workshop, the most expensive failure mode is the one quiet person who never got past step zero. Build the off-ramp before you need it.',
      },
      { type: 'heading', level: 2, text: 'Step 0 — scaffold the project' },
      {
        type: 'paragraph',
        html:
          'I used Create React App because the room was on different machines and CRA is the closest thing to "it just works." Tailwind got added in the same breath, because hand-rolling CSS during a live demo is a guaranteed off-topic detour.',
      },
      {
        type: 'code',
        lang: 'bash',
        code: 'npx create-react-app todo-app\ncd todo-app\nnpm install -D tailwindcss@3\nnpx tailwindcss init',
      },
      {
        type: 'paragraph',
        html:
          'Two config files, then we never look at the build system again for the rest of the session:',
      },
      {
        type: 'code',
        lang: 'js',
        code: `// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};`,
      },
      {
        type: 'code',
        lang: 'css',
        code: `/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;`,
      },
      { type: 'heading', level: 2, text: 'Step 1 — the page frame' },
      {
        type: 'paragraph',
        html:
          'First commit is always the shell. No components, no state, no logic — just a header, a card, and a footer. The point is to see something in the browser within the first three minutes, because nothing kills momentum like staring at a blank tab.',
      },
      { type: 'code', lang: 'jsx', code: TODO_SCAFFOLD },
      { type: 'heading', level: 2, text: 'Step 2 — components without state' },
      {
        type: 'paragraph',
        html:
          'Now I introduce the word "component." Two stubs — <code>TodoItem</code> and <code>TodoList</code> — and the only thing they prove is that React renders nested things in a predictable order. No <code>useState</code> yet. No props. Just JSX inside arrow functions.',
      },
      { type: 'code', lang: 'jsx', code: TODO_STUBS },
      {
        type: 'paragraph',
        html:
          'When a student asks "but where does the data come from?" — perfect, that\'s the next step.',
      },
      { type: 'heading', level: 2, text: 'Step 3 — state with useState' },
      {
        type: 'paragraph',
        html:
          'This is the first ideas-heavy moment. I tell the room three things and write them on the side of the screen: state lives in a component, <code>useState</code> returns a pair, and React re-renders when the setter is called. Then I show them what that looks like.',
      },
      { type: 'code', lang: 'jsx', code: TODO_USESTATE },
      {
        type: 'paragraph',
        html:
          'The <code>key</code> prop is the first prop they meet, and I make a small fuss about it. React needs identity for list reconciliation; <code>key={t.id}</code> is what gives it that. Saying it once now saves a "why does my list flicker" question later.',
      },
      { type: 'heading', level: 2, text: 'Step 4 — styling without breaking the build' },
      {
        type: 'paragraph',
        html:
          'Pure visual polish. Checkboxes, hover states, line-through for completed items. The handlers aren\'t wired up yet — the checkbox\'s <code>checked</code> reflects state but has no <code>onChange</code>. I leave it that way on purpose so the next step has something to fix.',
      },
      { type: 'code', lang: 'jsx', code: TODO_ITEM_STYLED },
      { type: 'heading', level: 2, text: 'Step 5 — lifting state up' },
      {
        type: 'paragraph',
        html:
          'This is the lesson I most wanted to land. <code>TodoItem</code> needs to flip <code>completed</code>, but it doesn\'t own the array. So the function lives in <code>App</code>, gets passed down as a prop, and <code>TodoItem</code> just calls it. State stays in one place; behaviour travels by prop.',
      },
      { type: 'code', lang: 'jsx', code: TODO_TOGGLE },
      {
        type: 'paragraph',
        html:
          'When I demoed it, a student asked "why not just put the state in <code>TodoItem</code>?" That is the question. The answer — "because the list lives above the item, and the item shouldn\'t know about its siblings" — is the entire reason hooks exist in the shape they do.',
      },
      { type: 'heading', level: 2, text: 'Step 6 — adding tasks' },
      {
        type: 'paragraph',
        html:
          '<code>TodoForm</code> is the first component with <em>its own</em> state (the controlled input) <em>and</em> a prop callback into the parent (<code>onAdd</code>). It\'s a tiny pattern but it\'s the one every form in React reuses.',
      },
      { type: 'code', lang: 'jsx', code: TODO_FORM },
      {
        type: 'paragraph',
        html:
          'I used <code>Date.now()</code> as the id, which is fine for a workshop and indefensible in production. I named that out loud — the demo id will collide if two tasks are added in the same millisecond, and the real fix is <code>crypto.randomUUID()</code> or a server-issued id. Better to flag the shortcut than pretend it isn\'t one.',
      },
      { type: 'heading', level: 2, text: 'Step 7 — deleting tasks' },
      {
        type: 'paragraph',
        html:
          'Same shape as toggle: handler in <code>App</code>, prop down to the item, button calls it. By now this should feel mechanical to the room — and that\'s the goal. Once the pattern is muscle memory, the next thing is just another variation.',
      },
      { type: 'code', lang: 'jsx', code: TODO_DELETE },
      { type: 'heading', level: 2, text: 'Step 8 — filters and the empty state' },
      {
        type: 'paragraph',
        html:
          'Two new ideas in one step: derived UI state, and not punishing a user who has nothing to look at. <code>filteredTodos</code> isn\'t stored — it\'s recomputed every render from the source of truth. And <code>TodoList</code> renders a friendly empty state instead of a void.',
      },
      { type: 'code', lang: 'jsx', code: TODO_FILTERS },
      {
        type: 'paragraph',
        html:
          'I called out the derivation explicitly. New React developers reach for <code>useState</code> for everything; teaching them to <em>compute</em> instead is one of the highest-leverage corrections you can make early.',
      },
      { type: 'heading', level: 2, text: 'Step 9 — the optional polish' },
      {
        type: 'paragraph',
        html:
          'Stats in the header — total, active, completed. Three derived numbers, three pills. It\'s the kind of finish that takes ninety seconds and makes the project feel done, which matters for students who are going to put this on their portfolio at the end of the day.',
      },
      { type: 'code', lang: 'jsx', code: TODO_STATS },
      { type: 'heading', level: 2, text: 'Shipping it' },
      {
        type: 'paragraph',
        html:
          'The last ten minutes were Git and Netlify. <code>git init</code>, push to a fresh GitHub repo, drag the repo into Netlify, watch the build go green. For a first-time React user, "I built this and it\'s on the internet" is the moment the abstraction stops being abstract. That\'s the moment the workshop is for.',
      },
      {
        type: 'paragraph',
        html:
          'For the curious, I left them with a <a href="https://github.com/Shalok-sys/DSEC_TO_DO_APP/tree/workshop-bugs" target="_blank" rel="noopener noreferrer">bug-hunt branch</a> — the same app with intentional bugs planted. The exercise is to find and fix them without me. The diff between "I followed the steps" and "I can debug what someone else wrote" is the actual skill we want them to leave with.',
      },
      { type: 'heading', level: 2, text: 'What I would change next time' },
      {
        type: 'list',
        ordered: false,
        items: [
          '<strong>Talk about <code>key</code> earlier.</strong> Two students hit the warning in the console before I had introduced it. Five seconds of "every item in a list needs a unique key" up front would have saved both of them.',
          '<strong>Show one bad version on purpose.</strong> Before lifting state up, I want to spend two minutes putting state in the wrong place and showing what breaks. The lesson lands harder when you\'ve seen the failure mode.',
          '<strong>Replace <code>Date.now()</code> with <code>crypto.randomUUID()</code>.</strong> Same number of characters, no hidden bug, and it teaches a real API instead of a demo shortcut.',
          '<strong>Skip CRA next time.</strong> Vite is faster, has better error messages, and the install is smaller. CRA is comfort food but the comfort isn\'t worth the cold start anymore.',
        ],
      },
      { type: 'heading', level: 2, text: 'Reflection' },
      {
        type: 'paragraph',
        html:
          'What surprised me about teaching this wasn\'t the React part — it was how much of the session was actually about pacing. The same nine steps in the same nine commits, but the difference between a student who got it and a student who didn\'t was almost always whether I waited the extra ten seconds before moving on. The framework is small. The conceptual jumps are not.',
      },
      {
        type: 'paragraph',
        html:
          'Credits to <strong>Shalok</strong> for the original <a href="https://github.com/Shalok-sys/DSEC_TO_DO_APP/" target="_blank" rel="noopener noreferrer">DSEC Todo app</a> the live coding session was built from, and to Vasu for the Git + GitHub slides that ran in parallel. The repos linked at the top of this post are the same ones the room had open the day we ran it.',
      },
      { type: 'heading', level: 2, text: 'Final App.js' },
      {
        type: 'paragraph',
        html:
          'The full file, identical in shape and behaviour to what we landed on at the end of the workshop.',
      },
      { type: 'code', lang: 'jsx', code: TODO_FINAL },
    ],
  },
  {
    slug: 'allarkive-bsides-2026',
    title: 'AllArkive — an offline AI library that refuses to hallucinate',
    date: '2026-05-17',
    readMin: 14,
    tags: ['allarkive', 'rag', 'privacy', 'local-ai', 'bsides'],
    excerpt: 'The talk we gave at BSides Melbourne 2026. We built a self-hosted, offline research assistant that enforces hallucination prevention at the API layer — not the prompt. Here is why that architectural choice is the only one that actually works.',
    featured: true,
    authors: [
      { name: 'Samridh Limbu', role: 'Software Engineer' },
      { name: 'Sham Polavarapu', role: 'Security Analyst & Researcher' },
    ],
    content: [
      {
        type: 'paragraph',
        dropCap: true,
        html: 'Almost everything you know — everything you can look up, fix, learn, treat — you\'re renting it. From companies that can raise the price, change the answer, or shut the door. And you never signed anything. That\'s the opening claim of the talk we gave at <strong>BSides Melbourne 2026</strong>, and it\'s the reason AllArkive exists.',
      },
      {
        type: 'paragraph',
        html: 'This is the writeup version of that talk. It covers the architecture, the key engineering decisions, and the parts we\'re most proud of — including the thing we think separates AllArkive from every other "RAG with citations" project out there: a hallucination gate that works at the API boundary, not the prompt layer.',
      },
      {
        type: 'blockquote',
        html: 'The internet was not supposed to be rented. It was supposed to be ours.',
      },
      { type: 'heading', level: 2, text: 'The problem is larger than it looks' },
      {
        type: 'paragraph',
        html: 'Wikipedia is blocked in different countries at different times. Stack Overflow too. The Internet Archive has been sued into near-oblivion more than once. Google search results are increasingly AI summaries that get things wrong with great confidence. Cloud services shut down whenever the company that owns them decides they\'re not profitable. Every time you ask ChatGPT a question, that question is logged somewhere, and you are not the customer.',
      },
      {
        type: 'paragraph',
        html: 'And then there\'s the failure mode that\'s rotting the information layer from inside: <strong>hallucination</strong>. Local AI right now has a well-documented problem — the model says what sounds plausible. People have built whole startups trying to fix this with clever prompts. "You are a helpful assistant who never lies, pretty please." That does not work. The model is a probability machine. Telling it not to lie is a softcoded suggestion, not a constraint.',
      },
      { type: 'heading', level: 2, text: 'AllArkive in one sentence' },
      {
        type: 'paragraph',
        html: '<em>A laptop-sized library with a local AI built in, designed to keep working when the internet doesn\'t.</em>',
      },
      {
        type: 'image',
        src: '/projects/allarkive/preview.png',
        alt: 'AllArkive running in Open WebUI — an offline AI answering questions with cited sources from a local ZIM archive',
        caption: 'AllArkive in Open WebUI — airgapped, no internet, cited sources from the local archive.',
      },
      {
        type: 'paragraph',
        html: 'In practice: you run one command. It downloads a bundle of ZIM files — Wikipedia, WikiMed, iFixit, Stack Exchange by default. It spins up a local AI model on your machine and a web interface on localhost. You open that page in your browser, ask it a question, and it answers using only the material in your archive. Every claim has a citation. You click the citation, it takes you to the actual article — hosted locally by Kiwix. Nothing leaves your machine. No internet required after the initial download. No accounts, no telemetry, no logging.',
      },
      {
        type: 'paragraph',
        html: 'If your internet is fine, it\'s a genuinely useful research tool. If your internet is not fine — censored, down, or simply unavailable — it\'s the most capable thing on your desk.',
      },
      { type: 'heading', level: 2, text: 'Three layers, each one independent' },
      {
        type: 'paragraph',
        html: 'The architecture has three replaceable layers. Each one works without the others — that\'s not an architectural nicety, it\'s a resilience guarantee. You can run Kiwix alone as an offline Wikipedia reader. You can run Ollama alone as a local LLM. The RAG pipeline is the glue that makes them talk to each other.',
      },
      { type: 'heading', level: 3, text: 'Layer 1 — Archive (Kiwix + ZIM)' },
      {
        type: 'paragraph',
        html: '<a href="https://kiwix.org" target="_blank" rel="noopener noreferrer">Kiwix</a> is an open-source project that packages entire websites — Wikipedia, Stack Exchange, Project Gutenberg, iFixit — into a single-file format called <strong>ZIM</strong>. The Kiwix team maintains these files and keeps them updated. We didn\'t build that; we\'re standing on their shoulders. What we built is the tooling to fetch the right bundle, verify checksums, and serve the files through a Kiwix container — plus a FastAPI layer that can read article text from the ZIM at query time.',
      },
      { type: 'heading', level: 3, text: 'Layer 2 — Local AI (Ollama + Qwen 2.5)' },
      {
        type: 'paragraph',
        html: '<a href="https://ollama.com" target="_blank" rel="noopener noreferrer">Ollama</a> is the cleanest way to run an open-weight model on your own machine. AllArkive defaults to <strong>Qwen 2.5 7B</strong>. It\'s not GPT-5. It doesn\'t need to be — the model isn\'t being asked to remember facts from training. It\'s being asked to synthesise a handful of relevant passages and write a coherent answer with citations. A 7B model on a laptop handles that well.',
      },
      { type: 'heading', level: 3, text: 'Layer 2½ — The RAG pipeline (FastAPI)' },
      {
        type: 'paragraph',
        html: 'RAG — Retrieval-Augmented Generation — is the interesting bit. Instead of asking the AI a question and hoping it remembers the right answer from training, the pipeline first searches the archive for relevant articles, hands those articles to the model, and says "answer using only this." The whole retrieval step is a few hundred lines of Python and a SQLite file:',
      },
      { type: 'code', lang: 'python', code: ALLARKIVE_RETRIEVE, label: 'scripts/rag/server.py — _retrieve()' },
      {
        type: 'paragraph',
        html: 'The vector store is <a href="https://github.com/asg017/sqlite-vec" target="_blank" rel="noopener noreferrer">sqlite-vec</a> — a SQLite extension that adds KNN search over embeddings stored in a virtual table. No separate database daemon, no schema migrations, no running service. The entire index is one file you can <code>rsync</code> or put on a USB stick.',
      },
      { type: 'heading', level: 2, text: 'The refusal gate' },
      {
        type: 'paragraph',
        html: 'Most "RAG with citations" systems enforce hallucination prevention at the prompt layer. They instruct the model not to hallucinate and trust it to comply. That\'s a softcoded suggestion to a probability machine.',
      },
      {
        type: 'paragraph',
        html: 'AllArkive enforces it at the <strong>API boundary</strong>. The RAG service is an OpenAI-compatible FastAPI endpoint. Look at what happens at that boundary when retrieval returns nothing:',
      },
      { type: 'code', lang: 'python', code: ALLARKIVE_REFUSAL, label: 'scripts/rag/server.py — /v1/chat/completions' },
      {
        type: 'paragraph',
        html: 'When <code>passages</code> is empty, <code>NO_SOURCES_TEXT</code> is returned immediately and <code>_call_ollama</code> is never reached. This is not a prompt instruction. This is a code branch. The model cannot hallucinate because it is never invoked. The system prompt is belt-and-braces — a secondary constraint — not the actual enforcement mechanism.',
      },
      {
        type: 'paragraph',
        html: '<code>NO_SOURCES_TEXT</code> is a fixed string: <em>"No relevant sources were found in the local archive for this question. The local knowledge base may not cover this topic. Try rephrasing, or check which bundle is installed."</em> The user gets an honest answer about why there\'s no answer, not a confident fabrication.',
      },
      { type: 'heading', level: 2, text: 'What the model is told' },
      {
        type: 'paragraph',
        html: 'When retrieval does return passages, the model receives a strict context window with explicit rules. The rules are belt-and-braces only — the real enforcement is the code branch above — but they matter for response quality:',
      },
      { type: 'code', lang: 'python', code: ALLARKIVE_PROMPT, label: 'scripts/rag/prompt.py' },
      {
        type: 'paragraph',
        html: 'The <code>[N]</code> markers the model writes are then rewritten by a post-processing step into actual Kiwix deep-links — anchored to the exact article that supplied the passage:',
      },
      { type: 'code', lang: 'python', code: ALLARKIVE_CITATIONS, label: 'scripts/rag/citations.py' },
      {
        type: 'paragraph',
        html: 'A reference like <code>[2]</code> in the model\'s answer becomes <code>[[2: Wound care (WikiMed)]](http://127.0.0.1:8081/wikipedia_en_medicine/...)</code>. You can click it. It opens the full article in Kiwix, served locally.',
      },
      { type: 'heading', level: 2, text: 'v0.2: the indexer rewrite' },
      {
        type: 'paragraph',
        html: 'v0.1 proved the concept. v0.2 made it usable on cheap hardware. Three things changed in the indexer.',
      },
      { type: 'heading', level: 3, text: 'Batched async embeddings — 10–30× faster' },
      {
        type: 'paragraph',
        html: 'v0.1 hit the Ollama <code>/api/embed</code> endpoint once per chunk — one HTTP round-trip per ~800 characters of text. Indexing Wikipedia took hours on a laptop CPU. v0.2 batches chunks into groups and sends them in a single request:',
      },
      { type: 'code', lang: 'python', code: ALLARKIVE_BATCH_EMBED, label: 'scripts/rag/indexer.py — _embed_batch()' },
      {
        type: 'paragraph',
        html: 'The speedup is 10–30× on CPU. On a laptop, the balanced bundle (~24 GB of ZIM content) now indexes in 10–25 minutes instead of hours.',
      },
      { type: 'heading', level: 3, text: 'int8 vector quantization — 4× smaller index' },
      {
        type: 'paragraph',
        html: 'v0.1 stored embeddings as <code>float32</code> arrays — 4 bytes per dimension. For the <code>nomic-embed-text</code> model (768 dimensions), that\'s 3,072 bytes per chunk. v0.2 packs them as <code>int8</code> — 1 byte per dimension, 768 bytes per chunk, 4× smaller. The recall drop on cosine-normalised models is sub-1 point on MTEB benchmarks:',
      },
      { type: 'code', lang: 'python', code: ALLARKIVE_QUANT, label: 'scripts/rag/quant.py — pack()' },
      { type: 'heading', level: 3, text: 'Offset-only chunk storage — index at ~25% of ZIM size' },
      {
        type: 'paragraph',
        html: 'v0.1 stored the full chunk text in the database. v0.2 stores only <code>(char_offset, char_len)</code> pointers into the ZIM file. The server reads the text from the ZIM at query time using the shared <code>textproc</code> extractor. The index drops from roughly 100% of ZIM size (in v0.1) to ~25%. On a Raspberry Pi where disk is the constraint, this is the change that makes the balanced bundle actually fit.',
      },
      { type: 'heading', level: 2, text: 'Five containers, one command' },
      {
        type: 'paragraph',
        html: 'The whole stack is five Docker services wired together with Docker Compose:',
      },
      { type: 'code', lang: 'yaml', code: ALLARKIVE_COMPOSE, label: 'compose/docker-compose.yml' },
      {
        type: 'paragraph',
        html: 'The OpenAI-compatible endpoint at <code>http://rag:8000/v1</code> means Open WebUI just sees a model called <code>allarkive-rag</code> in the model picker — alongside whatever Ollama models are installed. Any future client that speaks the OpenAI API works with zero integration code.',
      },
      {
        type: 'paragraph',
        html: 'Getting the stack running is a single command. The bootstrap script handles platform detection, disk space checks, port-conflict resolution, bundle checksums, model pulls, and prints a status summary:',
      },
      { type: 'code', lang: 'bash', code: ALLARKIVE_BOOTSTRAP, label: 'scripts/bootstrap.sh' },
      { type: 'heading', level: 2, text: 'Bundle tiers' },
      {
        type: 'paragraph',
        html: 'Three curated bundles ship at launch. Every ZIM checksum is verified by the bootstrap script — nobody can tamper with the archive between us and you.',
      },
      {
        type: 'table',
        headers: ['Bundle', 'Size', 'Contents', 'Target'],
        rows: [
          ['minimal', '~5 GB', 'WikiMed + iFixit repair guides', 'Raspberry Pi 4/5, any ~$90 board'],
          ['balanced', '~24 GB', '+ Wikipedia (mini) + Stack Exchange (Unix, SuperUser, Ask Ubuntu)', 'Laptop — the default'],
          ['comprehensive', '~411 GB', '+ Wikipedia (full, with images) + Project Gutenberg + Stack Overflow', 'Workstation or external drive'],
        ],
      },
      {
        type: 'paragraph',
        html: 'At the absolute minimum — the 5 GB bundle on a Pi — you have how to fix things and how to not die. The medical wiki and iFixit are the highest-value offline resources for an actual emergency.',
      },
      { type: 'heading', level: 2, text: 'Honest limits' },
      {
        type: 'paragraph',
        html: 'We didn\'t build a magic box. We built a useful tool with real limits, and we\'re upfront about both.',
      },
      { type: 'heading', level: 3, text: 'What it protects against' },
      {
        type: 'list',
        ordered: false,
        items: [
          '<strong>Your internet going down.</strong> Outages, censorship, ISP failures — the archive keeps working.',
          '<strong>Cloud rug-pulls.</strong> Services shut down when they\'re not profitable. Your local copy doesn\'t.',
          '<strong>Source censorship.</strong> If Wikipedia is blocked where you are, your downloaded copy isn\'t. After initial download, all traffic is local.',
          '<strong>Surveillance.</strong> What you search for never leaves your machine. No logs, no telemetry, no analytics.',
          '<strong>Hallucination (at the API layer).</strong> The model cannot fabricate because it is not called when there\'s nothing to cite from.',
        ],
      },
      { type: 'heading', level: 3, text: 'What it does not protect against' },
      {
        type: 'list',
        ordered: false,
        items: [
          '<strong>A targeted attacker with code execution on your laptop.</strong> AllArkive binds everything to 127.0.0.1 by default, but it\'s not a security product.',
          '<strong>Archive staleness.</strong> Wikipedia changes every second; your copy is a snapshot. The citations help you verify.',
          '<strong>Forced disclosure.</strong> Someone compelling you to hand over your laptop is out of scope.',
          '<strong>Custom bundles with bad content.</strong> If you build a custom bundle from untrusted sources, that\'s on you.',
          '<strong>Model answers being absolute.</strong> Citations are how you verify. We print a reminder after every response.',
        ],
      },
      {
        type: 'blockquote',
        html: 'This is a research tool. It is not your doctor. It is not your lawyer. It is a really, really good reference library with a librarian attached.',
      },
      { type: 'heading', level: 2, text: 'Who we built this for' },
      {
        type: 'paragraph',
        html: 'Honestly, us first. Both of us have family in places where the internet is not as friendly as Melbourne. That was the original itch. But as we talked to more people, the picture got larger.',
      },
      {
        type: 'paragraph',
        html: 'Librarians, who are worried about digital preservation. Teachers in remote schools with unreliable connectivity. Journalists in countries where Wikipedia is blocked. Parents who want their kids to look things up without algorithmic pipelines. People in rural Australia where the NBN goes down for a week and nothing works. People who cannot afford a thousand-dollar-a-month AI subscription and should not need one to have access to what should just be theirs.',
      },
      {
        type: 'paragraph',
        html: 'Wikipedia is free. The license permits exactly this use. The tools to run a local AI are free. The only thing missing was someone tying them together so a normal person can install it without a CS degree.',
      },
      {
        type: 'blockquote',
        html: 'You can run a useful AI on a Raspberry Pi now. You can have all of Wikipedia in your pocket. You can have a research assistant that nobody is logging. These are not science fiction. They\'re just not packaged.',
      },
      { type: 'heading', level: 2, text: 'Build with us' },
      {
        type: 'paragraph',
        html: 'AllArkive is <strong>AGPL-3.0</strong> — deliberately, not by default. GPL leaves a SaaS loophole: you can run GPL software as a hosted service without releasing your changes. AGPL closes it. A company cannot host AllArkive without open-sourcing their modifications.',
      },
      {
        type: 'paragraph',
        html: 'There is no funding round. There will never be a SaaS version. There will never be telemetry. We are two people who built something we needed and decided to give it away properly.',
      },
      {
        type: 'paragraph',
        html: 'We need people to break our installer on weird hardware. We need translators and librarians to help curate non-English bundles. We need security people to tear apart our threat model. If you find something wrong, we want to know. The repository is at <a href="https://github.com/clupai8o0/allarkive" target="_blank" rel="noopener noreferrer">github.com/clupai8o0/allarkive</a>.',
      },
      {
        type: 'blockquote',
        html: 'It will always be free. It will always be inspectable. If we both get hit by a bus, somebody else can fork it and keep going.',
      },
    ],
  },
  {
    slug: 'lock-in-embedded-focus-tracker',
    title: 'Lock-In: a desk-side embedded focus tracker you can build in a weekend',
    date: '2026-06-09',
    readMin: 14,
    tags: ['embedded', 'arduino', 'raspberry-pi', 'python', 'sit210'],
    excerpt: 'Every focus tool runs on the laptop you\'re trying not to get distracted by. I built a physical box instead. Arduino + Raspberry Pi + Gemini vision + a five-state FSM. Under AU$70. Boot-on-power.',
    featured: false,
    content: [
      { type: 'heading', level: 2, text: 'The story behind it' },
      {
        type: 'paragraph',
        dropCap: true,
        html: 'I built Lock-In because every tool for managing study focus lives on the exact device you are trying not to get distracted by. Pomodoro apps, browser blockers, screen-time dashboards. They all run on the laptop, they are easy to dismiss, and none of them can tell whether you actually focused or just left a timer ticking while you scrolled your phone in the other hand.',
      },
      {
        type: 'paragraph',
        html: 'A small physical box on the desk is a different kind of nudge. It watches the desk, makes one clear decision, and gives you feedback through lights and a buzzer. It is hard to ignore, hard to mute, and hard to game, because it is looking at the real world instead of at what the laptop reports.',
      },
      {
        type: 'paragraph',
        html: 'The build came together over a weekend in my room. A Raspberry Pi 4 is the brain (a Pi 4 is plenty, you do not need a Pi 5). An Arduino Uno runs all the sensors and the lights. A spare laptop on the same Wi-Fi acts as a wireless camera. One Gemini API call reads what the camera sees. A five-state machine on the Pi makes every decision. Total parts cost is under AU$70 if you already have a Pi.',
      },
      {
        type: 'paragraph',
        html: 'This is a teaching case, so I am not just going to show you my finished box. I want you to be able to build a similar one. The pieces are swappable on purpose, and I will point out the few contracts that hold the whole thing together as we go. If you follow along, you will end up with a working, boot-on-power, dashboard-equipped focus tracker of your own. Everything I built (schematics, firmware, Python source, systemd units, tests) is on GitHub at <a href="https://github.com/clupai8o0/lock-in-complete" target="_blank" rel="noopener noreferrer">github.com/clupai8o0/lock-in-complete</a> if you want a reference while you build.',
      },
      { type: 'image', src: '/projects/lock-in/dashboard.webp', alt: 'Lock-In dashboard showing IDLE state, pomodoro ring, distraction count, and system status pills', caption: 'The Flask dashboard at port 8080.' },
      { type: 'heading', level: 2, text: 'What it does, end to end' },
      {
        type: 'list',
        ordered: true,
        items: [
          '<strong>The Arduino watches the desk.</strong> A PIR detects whether anyone is sitting there. An ultrasonic sensor measures how far the user is from the screen. A DHT22 reads room temperature and humidity. An LDR reads ambient light. A button takes input. Three LEDs (red, yellow, green) and a passive piezo are the output.',
          '<strong>The Pi listens.</strong> Sensor frames stream over USB serial at 1 Hz as JSON. Button events are pushed the moment they happen.',
          '<strong>The camera looks.</strong> Every 75 seconds the Pi grabs a JPEG from a tiny Flask server running on a laptop, sends it to Google\'s Gemini API with a strict JSON prompt, and gets back <code>{focused, confidence, observation}</code>.',
          '<strong>The state machine decides.</strong> All of that goes into one pure-logic state machine that moves through <code>AWAY</code>, <code>IDLE</code>, <code>FOCUS</code>, <code>DEGRADING</code>, <code>BREAK</code>. It returns actions like <em>turn the LED yellow</em> or <em>play the confirm buzzer pattern</em>.',
          '<strong>The orchestrator acts.</strong> Those actions become serial writes back to the Arduino.',
          '<strong>The dashboard shows it.</strong> A Flask page on port 8080 displays the current state, a pomodoro ring, sensor stats, distraction count, and live online/offline pills for the Arduino, camera, and vision service.',
        ],
      },
      {
        type: 'paragraph',
        html: 'The whole loop runs on the Pi as two systemd services and boots automatically on power.',
      },
      { type: 'heading', level: 2, text: 'Things used in this project' },
      { type: 'heading', level: 3, text: 'Hardware' },
      {
        type: 'table',
        headers: ['Component', 'Qty', 'Notes'],
        rows: [
          ['PIR Motion Sensor (generic)', '1', 'Motion detection'],
          ['PTS 645 Series Switch (C&K), a normal push button', '1', 'Button input'],
          ['HC-SR04 Ultrasonic Sensor', '1', 'Distance to screen'],
          ['Passive piezo buzzer', '1', 'Audio feedback'],
          ['LED (generic)', '3', 'Red, yellow, green'],
          ['DHT22 Temperature and Humidity Sensor', '1', 'Temp + humidity'],
          ['Arduino UNO', '1', 'Sensor + actuator controller'],
          ['Raspberry Pi 4 Model B', '1', 'Runs the orchestrator and dashboard'],
          ['Spare laptop or phone (camera)', '1', 'Anything that can run a tiny web server on your Wi-Fi'],
          ['Photo resistor (LDR)', '1', 'Ambient light'],
          ['Breadboard (generic)', '1', ''],
          ['Resistor 220 Ω', '3', 'One per LED'],
          ['Resistor 10 kΩ', '1', 'Pull-up for the DHT22 data line, plus the LDR voltage divider'],
          ['Jumper wires', '1 pack', ''],
        ],
      },
      { type: 'heading', level: 3, text: 'Software' },
      {
        type: 'table',
        headers: ['Tool', 'Purpose'],
        rows: [
          ['Arduino IDE', 'Flash the firmware to the Uno'],
          ['Raspberry Pi OS (Raspbian)', 'OS on the Pi'],
          ['Python 3', 'Orchestrator and the Flask dashboard'],
          ['Google Gemini API key', 'Vision check — focused or not'],
        ],
      },
      { type: 'heading', level: 2, text: 'Step 1: wire the Arduino' },
      {
        type: 'paragraph',
        html: 'Here is the wiring laid out in Tinkercad so you can see the whole circuit at once.',
      },
      { type: 'image', src: '/projects/lock-in/circuit.webp', alt: 'Arduino Uno wiring diagram showing all sensors, LEDs, buzzer, and USB serial connection to Raspberry Pi', caption: 'Simulated in Tinkercad. The black TMP part on the breadboard stands in for the DHT22 (Tinkercad has no DHT22 part). In the real build that slot is a DHT22 on D7. The Raspberry Pi is not shown because the Arduino talks to it over USB only.' },
      { type: 'image', src: '/projects/lock-in/tinkercad.webp', alt: 'Tinkercad breadboard simulation showing HC-SR04, PIR, buzzer, LEDs, TMP (DHT22 stand-in), and LDR wired to an Arduino Uno', caption: 'The same circuit in Tinkercad\'s breadboard view. Colour-coded wires match the pin map below.' },
      {
        type: 'paragraph',
        html: 'This is the pin map I settled on. It groups inputs at the low-numbered end and outputs at the high end, which keeps the breadboard tidy.',
      },
      {
        type: 'list',
        items: [
          '<strong>D2</strong>: PIR OUT (<code>INT0</code>, rising edge interrupt).',
          '<strong>D3</strong>: Button (<code>INT1</code>, <code>INPUT_PULLUP</code>, active-low).',
          '<strong>D4</strong>: HC-SR04 TRIG (10 µs trigger pulse).',
          '<strong>D5</strong>: HC-SR04 ECHO (pulse width equals round-trip time).',
          '<strong>D6</strong>: LED red (+), 220 Ω to GND.',
          '<strong>D7</strong>: DHT22 DATA, with a 10 kΩ pull-up to 5 V.',
          '<strong>D8</strong>: LED yellow (+), 220 Ω to GND.',
          '<strong>D9</strong>: Buzzer (+), passive piezo, driven by <code>tone()</code>.',
          '<strong>D10</strong>: LED green (+), 220 Ω to GND.',
          '<strong>A0</strong>: LDR tap (LDR top to 5 V, A0 between the LDR and a 10 kΩ resistor to GND).',
          '<strong>5 V rail</strong>: PIR, HC-SR04, DHT22, LDR top.',
          '<strong>GND rail</strong>: everything\'s ground.',
        ],
      },
      {
        type: 'paragraph',
        html: 'The full ASCII schematic lives in <a href="https://github.com/Clupai8o0/lock-in-complete/blob/master/docs/circuit.md" target="_blank" rel="noopener noreferrer"><code>docs/circuit.md</code></a>.',
      },
      {
        type: 'paragraph',
        html: 'A few wiring gotchas worth calling out, all of which cost me time on the first attempt:',
      },
      {
        type: 'list',
        items: [
          'The DHT22 needs a 10 kΩ pull-up between DATA and VCC. If you bought the AM2302 breakout module it already has one on board, so do not add a second one.',
          'The HC-SR04 only works at 5 V. Wire it to a 3.3 V rail and it will quietly return zero echoes with no error to tell you why.',
          'The button does not need an external resistor. The firmware uses the Arduino\'s internal pull-up, so just wire D3 to the button to GND.',
        ],
      },
      {
        type: 'paragraph',
        html: 'Before you flash the real firmware, upload <code>arduino/lock_in_demo/lock_in_demo.ino</code> and open the Serial Monitor at 115200 baud. It cycles through every peripheral and prints a status line for each one, so you can confirm the wiring is sane before you put the orchestrator on top. This step saved me twice.',
      },
      { type: 'heading', level: 2, text: 'Step 2: flash the real firmware' },
      {
        type: 'paragraph',
        html: 'In the Arduino IDE, install the <strong>DHT sensor library</strong> by Adafruit (it will pull in Adafruit Unified Sensor automatically). Then open <code>arduino/lock_in_arduino/lock_in_arduino.ino</code>, pick <strong>Board: Arduino Uno</strong> and the right port, and hit upload.',
      },
      { type: 'paragraph', html: 'The firmware does four things on a loop:' },
      { type: 'paragraph', html: '<strong>1.</strong> Streams a 1 Hz JSON sensor frame to the Pi:' },
      {
        type: 'code',
        lang: 'json',
        code: '{"t":12345,"type":"frame","presence":true,"dist_cm":62.4,\n"temp_c":22.1,"hum":54.0,"light":418}',
      },
      { type: 'paragraph', html: '<strong>2.</strong> Pushes button events the moment they happen, tagged with the gesture (single, double, long):' },
      {
        type: 'code',
        lang: 'json',
        code: '{"t":12500,"type":"event","event":"button","action":"single"}',
      },
      { type: 'paragraph', html: '<strong>3.</strong> Listens for <code>cmd</code> messages from the Pi to drive the LEDs and buzzer:' },
      {
        type: 'code',
        lang: 'json',
        code: '{"cmd":"led","state":"FOCUS"}\n{"cmd":"buzz","pattern":"confirm"}',
      },
      {
        type: 'paragraph',
        html: '<strong>4.</strong> Runs the buzzer patterns and LED blinking from a non-blocking <code>millis()</code> loop. No <code>delay()</code> calls anywhere except the 10 µs ultrasonic trigger pulse.',
      },
      {
        type: 'paragraph',
        html: 'One thing worth knowing if you build your own. The button interrupt does almost nothing. It just records which edge fired and the timestamp, then sets a flag. The main loop reads those timestamps, debounces them, and works out whether it was a single, double, or long press. Keeping the slow work out of the interrupt is what stops the button from feeling janky.',
      },
      {
        type: 'paragraph',
        html: 'The point of keeping the Arduino dumb is that anything timing-sensitive (button debounce, LED blink cadence, buzzer patterns) lives in the microcontroller. The Pi never has to worry about whether its serial write landed on time, and the Arduino never has to worry about anything the Pi is doing. If you are adapting this, that split is the first design choice to copy.',
      },
      { type: 'heading', level: 2, text: 'Step 3: set up the Pi' },
      {
        type: 'code',
        lang: 'bash',
        code: `sudo apt update && sudo apt install -y python3-venv python3-pip git
sudo usermod -a -G dialout "$USER"
# log out and back in for the group change to take effect

git clone https://github.com/clupai8o0/lock-in-complete ~/lock-in
cd ~/lock-in/pi
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt`,
      },
      {
        type: 'paragraph',
        html: 'Now copy <code>pi/.env.example</code> to <code>pi/.env</code> and fill in your Gemini API key and the laptop\'s LAN IP (next step).',
      },
      { type: 'heading', level: 2, text: 'Step 4: run the camera server on a spare laptop' },
      {
        type: 'paragraph',
        html: 'I first planned to use an ESP32-CAM, but in my room it kept dropping frames over Wi-Fi and the JPEGs came back blurry under desk lamps. The simpler answer was a tiny Flask server on a spare laptop that serves a JPEG on <code>GET /capture</code> whenever it is asked. The Pi pulls a frame on its own schedule.',
      },
      {
        type: 'paragraph',
        html: 'That swap is a good example of the "keep the pieces swappable" idea. The Pi never cared what was on the other end of that URL, so changing the camera was a one-line config change, not a rewrite. If you want to use a phone or an ESP32-CAM instead, you only have to serve a JPEG at one URL.',
      },
      {
        type: 'code',
        lang: 'bash',
        code: 'cd mac_camera\npip install -r requirements.txt\npython mac_camera_server.py --port 8081',
      },
      {
        type: 'paragraph',
        html: 'Find the laptop\'s IP (<code>ipconfig getifaddr en0</code> on macOS, <code>hostname -I</code> on Linux). From the Pi, confirm it works:',
      },
      {
        type: 'code',
        lang: 'bash',
        code: 'curl http://<laptop-ip>:8081/capture --output test.jpg',
      },
      {
        type: 'paragraph',
        html: 'Set <code>CAMERA_URL=http://&lt;laptop-ip&gt;:8081/capture</code> in the Pi\'s <code>.env</code>.',
      },
      { type: 'heading', level: 2, text: 'Step 5: run it' },
      {
        type: 'code',
        lang: 'bash',
        code: 'cd ~/lock-in/pi\nsource .venv/bin/activate\n./run.sh',
      },
      {
        type: 'paragraph',
        html: '<code>run.sh</code> starts both the orchestrator and the Flask dashboard. Open <code>http://&lt;pi-ip&gt;:8080/</code> in any browser on your LAN. You will see a state badge, a pomodoro ring, four stat cards, and three "system" pills showing Arduino, Camera, and Vision online status.',
      },
      {
        type: 'paragraph',
        html: 'Sit at the desk and the state goes to IDLE within five seconds. Single-press the button and the state goes to FOCUS, the buzzer plays the confirm pattern, and the session begins. Pick up your phone in front of the camera and the state goes to DEGRADING while the buzzer nags you back.',
      },
      {
        type: 'paragraph',
        html: 'To make it persistent across reboots, install the two systemd units in <code>pi/systemd/</code> and enable them. The Pi then becomes a fully autonomous appliance. Power it on and it just works.',
      },
      { type: 'heading', level: 2, text: 'How the code is organised' },
      {
        type: 'paragraph',
        html: 'The core of the Pi side is a handful of small Python files, each doing one job. That one rule is what kept the project from sprawling.',
      },
      {
        type: 'code',
        lang: 'text',
        code: `pi/
  config.py          # env vars to a dataclass
  database.py        # SQLite schema + queries
  serial_reader.py   # async Arduino bridge, auto-reconnect
  camera_client.py   # async HTTP /capture client
  vision_judge.py    # Gemini call + strict JSON parser
  fsm.py             # the state machine, pure logic
  orchestrator.py    # wires every module into asyncio tasks
  main.py            # entry point
  dashboard/app.py   # Flask, read-only over snapshot.json + SQLite`,
      },
      {
        type: 'paragraph',
        html: 'There is also a small MQTT bus (<code>mqtt_bus.py</code>) and a watchdog helper (<code>sd_notify.py</code>) if you want the dashboard and orchestrator to talk over MQTT and report health to systemd, but you can ignore both to start with.',
      },
      {
        type: 'paragraph',
        html: 'The single most important design decision is that <strong>the state machine is pure logic</strong>. No I/O, no threads, no globals, no reading the wall clock inside the logic. The orchestrator pushes events in (<code>on_sensor_frame</code>, <code>on_button</code>, <code>on_vision</code>, <code>tick</code>) and the state machine returns a list of <code>Action</code> records. The orchestrator then turns those actions into side effects.',
      },
      {
        type: 'code',
        lang: 'python',
        label: 'pi/fsm.py — the shape of an action',
        code: `@dataclass
class Action:
    kind: ActionKind  # SESSION_START, LED, BUZZ, ...
    payload: dict = field(default_factory=dict)`,
      },
      {
        type: 'paragraph',
        html: 'If you are building a similar project, this is the part to copy first, because it is the contract that makes everything else easy to test and reason about. The transitions themselves are simple:',
      },
      {
        type: 'table',
        headers: ['From', 'What happens', 'To'],
        rows: [
          ['AWAY', 'PIR sees someone sit down', 'IDLE'],
          ['IDLE', 'single button press', 'FOCUS (start session, confirm buzzer)'],
          ['FOCUS', 'vision says you are not focused', 'DEGRADING (open a distraction, nag buzzer)'],
          ['DEGRADING', 'vision says you are focused again', 'FOCUS (close the distraction)'],
          ['FOCUS', 'the pomodoro timer runs out', 'BREAK'],
          ['any', 'PIR sees nobody for a while', 'AWAY'],
        ],
      },
      {
        type: 'paragraph',
        html: 'Because the logic is pure, you can test the whole thing with a fake clock and no hardware at all. Here is one test that walks a full distraction-then-recovery cycle:',
      },
      {
        type: 'code',
        lang: 'python',
        label: 'pi/test_fsm.py',
        code: `def test_vision_distraction_then_recovery(self):
    self.fsm.on_sensor_frame(self._frame())
    self.clock.advance(6.0); self.fsm.tick()
    self.fsm.on_button("single")
    self.assertEqual(self.fsm.state, State.FOCUS)

    actions = self.fsm.on_vision(VisionInput(False, 0.9, "phone in hand"))
    self.assertEqual(self.fsm.state, State.DEGRADING)
    self.assertIn(ActionKind.DISTRACTION_OPEN, _kinds(actions))

    self.fsm.on_sensor_frame(self._frame())
    self.fsm.on_vision(VisionInput(True, 0.9, "looking at screen"))
    self.clock.advance(70.0)
    self.fsm.on_sensor_frame(self._frame())
    actions = self.fsm.tick()
    self.assertEqual(self.fsm.state, State.FOCUS)
    self.assertIn(ActionKind.DISTRACTION_CLOSE, _kinds(actions))`,
      },
      {
        type: 'paragraph',
        html: 'There are 13 of these. Run them with:',
      },
      {
        type: 'code',
        lang: 'bash',
        code: 'cd pi && python -m unittest test_fsm.py',
      },
      {
        type: 'paragraph',
        html: 'The second most important decision is that <strong>everything degrades gracefully</strong>. A failed Gemini call is one log line and a skipped cycle. An unplugged Arduino is a 5-second reconnect loop while the state machine holds whatever state it was in. A missing camera server is the same idea: vision pauses and the sensor logic keeps running. None of these is an error. They are all designed-for code paths.',
      },
      {
        type: 'paragraph',
        html: 'Here is what that looks like in the camera client:',
      },
      {
        type: 'code',
        lang: 'python',
        label: 'pi/camera_client.py',
        code: `try:
    async with self._session.get(self.url) as resp:
        if resp.status != 200:
            self.online = False
            return None
        jpeg = await resp.read()
        ...
        self.online = True
        return CameraCapture(jpeg=jpeg)
except asyncio.TimeoutError:
    self.last_error = "timeout"
    self.online = False
    return None
except aiohttp.ClientError as e:
    self.last_error = f"client error: {e}"
    self.online = False
    return None`,
      },
      {
        type: 'paragraph',
        html: 'No <code>raise</code>, only <code>return None</code>. The orchestrator checks for None and moves on. The dashboard reads the <code>online</code> flag and shows the status to the user. That one convention made the rest of the system simpler to write and reason about.',
      },
      { type: 'heading', level: 2, text: 'What you can extend' },
      {
        type: 'paragraph',
        html: 'This setup is small enough to read in one sitting, and it is built so each module can be swapped without touching the others. A few directions if you want to keep going:',
      },
      {
        type: 'list',
        items: [
          '<strong>Local vision model.</strong> Replace <code>vision_judge.py</code> with an Ollama plus Moondream2 version. Same return type, same <code>judge(jpeg)</code> shape. You would lose the API dependency entirely.',
          '<strong>More gestures.</strong> The Arduino already decodes single, double, and long press. Adding a quintuple-press for "panic-end-session" is a one-line change in <code>fsm.on_button</code>.',
          '<strong>Habit graphs.</strong> The dashboard has a <code>/history</code> page and a CSV export but no graphs yet. The data model already records every transition with a timestamp, so a Chart.js view over the last 30 days would be about 20 lines of JavaScript.',
          '<strong>Mobile dashboard.</strong> It works on a phone but is cramped, since the layout is desktop-first today.',
        ],
      },
      { type: 'heading', level: 2, text: 'Reflection' },
      {
        type: 'paragraph',
        html: 'Writing this article turned out to be the best debugging tool I had on the whole project. Going through it section by section forced me to re-read every module from a stranger\'s point of view. I found a handful of dead imports, one near-duplicate JSON call, and a sensor threshold that had been wrong since the second day, and I cleaned all of them up while drafting.',
      },
      {
        type: 'paragraph',
        html: 'More importantly, explaining <em>why</em> each decision was made surfaced the real lesson. The cleanest fault-tolerant systems are the ones where failure is part of the normal API of every module, not something bolted on at the end. As soon as <code>camera_client.capture()</code> returned <code>None</code> on any error and the orchestrator treated that as a normal code path, the rest of the system got simpler. No exception flows, no "is this thing still alive?" branching, no special cases. That idea, that handling absence is cheaper than handling exceptions, is the thing I will carry into the next embedded project. Producing a teaching case is what made me notice it, so I found the format genuinely useful for my own learning, not just for the marks.',
      },
      { type: 'heading', level: 2, text: 'Disclosure' },
      {
        type: 'paragraph',
        html: 'This article is part of an assignment submitted to <strong>Deakin University, School of IT, Unit SIT210/730 Embedded Systems Development</strong> (Task 10.1D: Project Teaching Case). Repository: <a href="https://github.com/clupai8o0/lock-in-complete" target="_blank" rel="noopener noreferrer">github.com/clupai8o0/lock-in-complete</a>.',
      },
    ],
  },
  {
    slug: 'sit314-batched-assignment',
    title: 'Batched assignment in a driverless-taxi fleet',
    date: '2026-08-27',
    readMin: 11,
    tags: ['iot', 'scalability', 'algorithms', 'node'],
    excerpt:
      'I swapped my taxi dispatcher\'s first-come, nearest-car rule for a batched hill climb adapted from a 2017 DiDi paper. Under load, mean pickup distance fell by about a quarter and p95 match latency roughly doubled. The first sweep also broke the worker, most likely through my code rather than the algorithm.',
    featured: true,
    content: [
      {
        type: 'paragraph',
        dropCap: true,
        html:
          'My SIT314 project was the cloud backend for a fleet of simulated driverless taxis. A rider asks for a car and a dispatch service picks one. For the High Distinction task I had to find the state of the art on one part of my own system, apply it, and measure what changed. I wrote it for SIT314 Software Architecture and Scalability for the Internet of Things at Deakin, in Trimester 2 2026. This post is that paper, cut down. The walkthrough comes first, then the numbers, then what I would not claim from them.',
      },
      { type: 'heading', level: 2, text: 'The system it applies to' },
      {
        type: 'paragraph',
        html:
          'The project also moved its queue, dispatch worker and state service to AWS, but every measurement in this post ran on one laptop. 2,000 simulated taxis publish telemetry over MQTT. A Node-RED flow filters the stream, a state service keeps live per-car state and answers "which free cars are near this point", and ride requests go on a queue. Dispatch workers pull requests off the queue, ask for candidates and claim a car. An autoscaler adds workers when the backlog grows. The service area is a box about 20 km by 16 km centred on the Melbourne CBD, split into nine zones.',
      },
      {
        type: 'paragraph',
        html:
          'The load harness ramps requests through five stages: 200, 800, 1,600 and 3,000 a second, then back to 800. A matched car is held for 300 ms to stand in for a trip. In the project report the platform topped out near 950 matches a second at the peak stage, with about 61,000 requests left without a car, while match latency stayed flat. I read the limit as the number of free cars, though my instrumentation could not cleanly separate an empty candidate list from cars claimed first by someone else.',
      },
      {
        type: 'image',
        src: '/writing/sit314-batched-assignment/fleet-ceiling.webp',
        alt: 'Line chart of rides matched per second against offered requests per second. Both runs follow the offered line up to about 800, then flatten near 950 matches a second while the offered line keeps rising to 3,000.',
        caption: 'From the project report. One dispatch worker and an autoscaled set hit the same ceiling. The last stage drops back to 800 a second, which is why each line doubles back.',
        lightBg: true,
      },
      { type: 'heading', level: 2, text: 'The decision I went looking for' },
      {
        type: 'paragraph',
        html:
          'The dispatch worker pulls up to eight requests off the queue at once. Then it throws that grouping away. Each request races for its own nearest free car, with no reference to the other seven in its hand.',
      },
      {
        type: 'paragraph',
        html:
          'DiDi Chuxing describe a close relative of this arrangement as the thing they replaced: each order matched on its own to its best-scoring driver. <a href="https://doi.org/10.1145/3097983.3098138" target="_blank" rel="noopener noreferrer">Zhang et al. (2017)</a> call it Model 1 and say it "was used at Didi Chuxing until the method of this paper was proposed". Their replacement optimises over a whole batch. They ran it live for a day on Beijing traffic against two models used in industry, one of them DiDi\'s own previous dispatcher, splitting drivers and orders into three flows by phone number. Global success rate went from 79.8% on the old model to 84.4% on theirs.',
      },
      {
        type: 'paragraph',
        html:
          '<a href="https://doi.org/10.1287/msom.2024.1074" target="_blank" rel="noopener noreferrer">Eom and Toriello (2026)</a> give the theory for when this should help and when it should not. They compare matching straight away with holding requests and solving over the pool. On a Manhattan ride-sharing instance they report that "the modified greedy and batching policies are both already within 91% of optimal for a sojourn period of 6", reaching 95% or better at 18, while plain greedy "achieves less than 70% in all cases". The cost is that under batching "agents wait in the system on average for half of the sojourn period".',
      },
      {
        type: 'paragraph',
        html:
          'One paper says the mechanism works in production. The other says the size of the win depends on how thick the market is. So even a null result would have told me something.',
      },
      { type: 'heading', level: 2, text: 'What does not transfer' },
      {
        type: 'paragraph',
        html:
          'DiDi\'s Algorithm 1 is a hill climb. Seed every driver with the order it scores highest on and work out the mean success rate. Then, for each order, walk the drivers not holding it and keep any swap that raises the mean. The objective for order <em>i</em> is:',
      },
      {
        type: 'equation',
        html: 'E<sub>i</sub> = 1 − ∏<sub>j</sub> (1 − p<sub>ij</sub>)<sup>a<sub>ij</sub></sup>',
      },
      {
        type: 'paragraph',
        html:
          'Here <em>p<sub>ij</sub></em> is a learned probability that driver <em>j</em> accepts order <em>i</em>, and <em>a<sub>ij</sub></em> is 1 when order <em>i</em> is sent to driver <em>j</em>. The product is there because an order goes out to several drivers and any one of them may take it. More drivers on an order means a better chance somebody says yes.',
      },
      {
        type: 'paragraph',
        html:
          'I transliterated that first. My system has no acceptance model, so I swapped <em>p<sub>ij</sub></em> for a score from the pickup distance, <code>1 / (1 + metres / 500)</code>. It came out worse than the greedy matcher it was meant to beat. Over 500 batches of eight requests against 200 free cars it averaged 736 m of pickup distance. Greedy averaged 660 m, so that is 11.5% worse. The adapted version below averaged 657 m.',
      },
      {
        type: 'paragraph',
        html:
          'That is not a bug in their algorithm. A driverless car does not refuse a job. Once the claim succeeds <em>p<sub>ij</sub></em> is effectively 1, the product collapses to one term, and putting five cars on one request stops being insurance. It becomes four cars sent to the wrong place.',
      },
      {
        type: 'paragraph',
        html:
          'So I kept the search and dropped the broadcast. Each request gets at most one car and each car at most one request. <em>E<sub>i</sub></em> becomes the score of whichever car holds request <em>i</em>.',
      },
      {
        type: 'paragraph',
        html:
          'Two parts of my version are mine rather than theirs. Algorithm 1 seeds by giving every driver its own best order. Mine seeds with the greedy answer and only accepts moves that raise the total score, so it starts from what the project already did. And Algorithm 1 moves one driver at a time, while mine does a two-way swap when the car it wants is already held, which the one-to-one rule makes necessary. Both versions live in <code>lib/assign.js</code> and both were measured.',
      },
      {
        type: 'code',
        lang: 'javascript',
        label: 'lib/assign.js, the adapted hill climb after the greedy seed (one comment edited)',
        code: `var moved = true, passes = 0;
while (moved && passes < 4) {               // capped at four passes
    moved = false;
    passes++;
    for (var i3 = 0; i3 < N; i3++) {
        for (var vid in score[i3]) {
            if (holder[i3] === vid) continue;
            var other = owner[vid];
            var before, after;
            if (other === undefined) {
                // free car. only request i3 changes.
                before = val(i3, holder[i3]);
                after = val(i3, vid);
                if (after > before) {
                    if (holder[i3] !== null) delete owner[holder[i3]];
                    holder[i3] = vid; owner[vid] = i3;
                    moved = true;
                }
            } else {
                // held by another request, so this is a swap and both move.
                // my car only goes to the other request if it is actually a
                // candidate for it, otherwise that request comes away empty.
                var mine = holder[i3];
                var mineFitsOther = mine !== null && score[other][mine] !== undefined;
                before = val(i3, mine) + val(other, vid);
                after = val(i3, vid) + (mineFitsOther ? val(other, mine) : 0);
                if (after > before) {
                    holder[i3] = vid; owner[vid] = i3;
                    if (mineFitsOther) { holder[other] = mine; owner[mine] = other; }
                    else { holder[other] = null; if (mine !== null) delete owner[mine]; }
                    moved = true;
                }
            }
        }
    }
}`,
      },
      { type: 'heading', level: 2, text: 'Designing it in' },
      {
        type: 'paragraph',
        html:
          'The change is in the dispatch worker. A <code>MATCH</code> environment variable picks the policy, so one binary runs both arms and nothing else about a run differs. In batch mode the worker keeps receiving until a time window runs out or the batch is full.',
      },
      {
        type: 'code',
        lang: 'javascript',
        label: 'dispatch_worker.js, the receive loop (simplified)',
        code: `if (MATCH === 'batch') {
  var deadline = Date.now() + WINDOW_MS;
  while (running && Date.now() < deadline && msgs.length < MAX_BATCH) {
    var more = await get(QUEUE + '/queue/rides/receive?max=' + BATCH);
    if (more.messages && more.messages.length) msgs = msgs.concat(more.messages);
    else await sleep(5);
  }
  await handleBatch(msgs);
} else {
  await Promise.all(msgs.map(m => handle(m)));
}`,
      },
      {
        type: 'paragraph',
        html:
          '<code>handleBatch</code> asks the state service for candidates for every request in the batch, solves the assignment, then claims. A claim can still lose a race to another worker. When that happens the request falls back down its own candidate list rather than being dropped.',
      },
      {
        type: 'paragraph',
        html:
          'The load harness already had the number I needed and was throwing it away. The worker publishes the pickup distance in metres on every match. The harness subscribed to that topic and ignored the field, so recording it was a small change.',
      },
      { type: 'heading', level: 2, text: 'Offline: where batching pays and where it does not' },
      {
        type: 'paragraph',
        html:
          'Before touching the running system I measured the decision on its own. An offline bench builds batches of requests against a 2,000-car fleet with a set share of cars already busy, and runs both policies on identical inputs. Queueing, claim races and the batch window are out of the picture. The knob that matters is how many free cars there are per request in the batch.',
      },
      {
        type: 'table',
        headers: ['Batch', 'Free cars', 'Cars per request', 'Greedy (m)', 'Batched (m)', 'Change', 'Batches won'],
        rows: [
          ['8', '800', '100.0', '322', '321', '−0.1%', '5 of 300'],
          ['8', '10', '1.3', '4,607', '4,224', '−8.3%', '235 of 300'],
          ['32', '800', '25.0', '325', '323', '−0.7%', '86 of 300'],
          ['32', '10', '0.3', '5,505', '1,838', '−66.6%', '300 of 300'],
          ['128', '800', '6.3', '338', '332', '−1.7%', '291 of 300'],
          ['128', '10', '0.1', '5,427', '833', '−84.7%', '300 of 300'],
        ],
      },
      {
        type: 'paragraph',
        html:
          'Each row is 300 batches. A batch counts as won when, on the same input, the hill climb matched more riders than greedy, or the same number with less total distance.',
      },
      {
        type: 'paragraph',
        html:
          'In a thick market the two policies are the same thing. With 800 free cars and eight requests, the nearest car to one request is almost never the nearest car to another. There is nothing to trade, and 295 of 300 batches came out identical. As the market thins, greedy\'s ordering starts to matter. At 128 requests against 10 free cars, both policies serve 10 riders per batch. Greedy serves the first 10 to ask and the search serves the 10 nearest the free cars, so the 85% shorter mean comes partly from serving different riders.',
      },
      {
        type: 'paragraph',
        html:
          'This fits Eom and Toriello\'s picture, where a bigger pool lets batching get close to optimal while plain greedy stays well short. Their pool grows with waiting time and mine with requests per free car, so I am drawing an analogy and have not replicated their result.',
      },
      { type: 'heading', level: 2, text: 'End to end, on the running platform' },
      {
        type: 'paragraph',
        html:
          'The offline result says the mechanism works. The project needed to know whether it survives queueing, claim races and a fleet whose cars come and go. I used the same five-stage ramp as the project report: 2,000 vehicles, one dispatch worker, a matched car held for 300 ms, everything else held still. The greedy arm ran twice and its figures are the mean of the two. The batched arm holds requests for up to 250 ms or until it has 64, whichever comes first.',
      },
      {
        type: 'chart',
        kind: 'line',
        title: 'Batching cut mean pickup distance once the fleet was under load',
        subtitle: 'Metres per matched rider across the five-stage ramp, lower is better',
        xLabel: 'offered',
        unit: 'm',
        categories: ['200/s', '800/s', '1,600/s', '3,000/s', '800/s'],
        series: [
          { name: 'Greedy', values: [238, 1189, 968, 1044, 1074] },
          { name: 'Batched', values: [237, 861, 777, 796, 820] },
        ],
      },
      {
        type: 'table',
        headers: ['Offered/s', 'Greedy mean m', 'Greedy p95 m', 'Greedy p95 ms', 'Batched mean m', 'Change', 'Batched p95 m', 'Batched p95 ms'],
        rows: [
          ['200', '238', '500', '29', '237', '−0.4%', '497', '283'],
          ['800', '1,189', '6,412', '34', '861', '−27.6%', '3,528', '112'],
          ['1,600', '968', '4,260', '40', '777', '−19.7%', '3,029', '111'],
          ['3,000', '1,044', '4,868', '94', '796', '−23.8%', '3,065', '111'],
          ['800', '1,074', '5,154', '36', '820', '−23.6%', '3,326', '113'],
        ],
      },
      {
        type: 'paragraph',
        html:
          'Across the four loaded stages, greedy averaged 1,068 m of pickup distance and the batched arm averaged 814 m. At the 95th percentile the gap was wider, 5,174 m against 3,237 m. The rider who was going to wait longest gained most, which is the half of the distribution I care about. Match latency went the other way. At the 95th percentile it rose from 51 ms to 112 ms.',
      },
      {
        type: 'paragraph',
        html:
          'The first stage is the control, and it is the most useful row in the table. At 200 requests a second the fleet is thick. Pickup distance is the same to within a metre, so they are probably picking the same cars, and the batched arm pays the whole latency cost for nothing. That is the offline finding showing up unchanged in the live system.',
      },
      {
        type: 'paragraph',
        html:
          'The fallback has a cost too. When the solver\'s car has gone, or the solver left the request without one, the worker walks that request\'s own candidate list. In the 250 ms run it fell back 683 times in 79,942 matches, a little under 1%. The fallback also does not know what the solver promised the other requests in the same batch, so it can take a car a batchmate was about to claim. At under 1% it probably does not move the means much. It does mean the assignment that runs is not always exactly the one the hill climb computed.',
      },
      { type: 'heading', level: 3, text: 'The knob that actually moves it' },
      {
        type: 'paragraph',
        html:
          'I ran the batch window at 250, 500 and 1,000 ms and it barely mattered: 814, 818 and 858 m across the loaded stages. The window is not what ends a batch at these rates. At 800 requests a second, 64 requests arrive in about 80 ms, so the size limit is hit long before the window runs out. I did not time batches, so that is arithmetic and not a measurement.',
      },
      {
        type: 'paragraph',
        html:
          'Batch size is the real knob. For this sweep I held the window at 2,000 ms so it never binds, and labelled each row by the batch size the worker actually reached. The receive call takes up to eight messages before the size limit is checked, so eight is the floor and asking for four gets eight. That is a bug in my loop. It gave me a free replicate, since the runs at 4 and 8 are the same condition. They came out at 1,062 and 1,051 m, eleven metres apart. Their p95 latencies were 42 and 152 ms, so the 97 ms in the table is an average of two quite different runs.',
      },
      {
        type: 'chart',
        kind: 'bar',
        title: 'Mean pickup distance falls as the batch grows',
        subtitle: 'Metres per matched rider, lower is better',
        xLabel: 'batch',
        unit: 'm',
        categories: ['greedy', '8', '16', '32', '65', '129'],
        series: [{ name: 'Mean pickup distance', values: [1068, 1056, 1018, 998, 828, 667] }],
      },
      {
        type: 'table',
        headers: ['Mean batch', 'Runs', 'Mean m', 'vs greedy', 'p95 m', 'p95 ms'],
        rows: [
          ['greedy, up to 8 at once', '2', '1,068', '–', '5,174', '51'],
          ['8', '2', '1,056', '−1.1%', '5,048', '97'],
          ['16', '1', '1,018', '−4.8%', '4,595', '86'],
          ['32', '1', '998', '−6.6%', '4,564', '110'],
          ['65', '1', '828', '−22.5%', '3,336', '115'],
          ['129', '1', '667', '−37.6%', '2,416', '167'],
        ],
      },
      {
        type: 'paragraph',
        html:
          'Mean pickup distance falls at every step as the batch grows, and the total matched barely moves: 80,183 for greedy against 79,847 at a batch of 128, a 0.4% difference. So batching is not buying shorter trips by refusing riders. It sends the same number of cars to better places. The latency column is noisier, because a batch that fills early and one that waits out its window behave differently. I would want more than one run per row before reading much into any single latency figure.',
      },
      { type: 'heading', level: 2, text: 'The failure I found by sweeping that knob' },
      {
        type: 'paragraph',
        html:
          'The first time I ran that sweep it broke. This is the harness output at a batch of 128, with four latency columns cut out to fit the page.',
      },
      {
        type: 'image',
        src: '/writing/sit314-batched-assignment/size128-collapse.webp',
        alt: 'Terminal output of the load harness at a batch size of 128. Stage one matched 3,422 of 4,000 requests, stage two matched 4 of 16,000, and stages three and four matched none.',
        caption: 'The first size sweep at a batch of 128. From stage two it matched almost nothing, and from stage three nothing at all. The fifth stage, also zero, is left off.',
      },
      {
        type: 'paragraph',
        html:
          'At a batch of 128 the worker matched almost nothing from stage two, and nothing at all from stage three. At 64 it fell over during the last stage. The likely cause was in my own code. <code>handleBatch</code> asked the state service for candidates one request at a time, in a loop, awaiting each one. So the wall-clock cost of a batch grew with its size. The queue hides a received message for 20 seconds, and a batch that takes longer than that has lost its claim on the work before it finishes.',
      },
      {
        type: 'paragraph',
        html:
          'I have to be careful how far I push that. I never timed a batch, the 20 seconds is the queue\'s setting rather than a measurement, and how the run failed to recover is inference. The log also shows every request answered with no vehicle, which I cannot fully explain. The serial version is not in git either, so the before code rests on the paper alone. What is measured is that the serial version stopped matching under load at 128 and the parallel version does not. The fix was to send the lookups together and settle the claims together.',
      },
      {
        type: 'code',
        lang: 'javascript',
        label: 'dispatch_worker.js, handleBatch after the fix',
        code: `var cands = await Promise.all(reqs.map(r =>
  get(STATE + '/candidates?lat=' + r.lat + '&lng=' + r.lng +
      '&minBattery=' + MIN_BATTERY + '&limit=10')
    .then(c => c.candidates || [])
    .catch(() => [])));

var picked = assign.hillClimb(reqs, cands);

await Promise.all(msgs.map((m, j) => settle(m, picked[j], cands[j])));`,
      },
      {
        type: 'paragraph',
        html:
          'Every number above is from after that change. The algorithm was fine at every batch size I tried. What failed was a serial loop inside a service whose input size I had just made variable. It failed the way the unit warns about: work pushed past a timeout somewhere else in the system, so a slowdown turns into a retry storm. I learned more from it than from the headline result.',
      },
      { type: 'heading', level: 2, text: 'What it says, and what it does not' },
      {
        type: 'paragraph',
        html:
          'Batching is worth having on this system, for a reason I only found by measuring. My fleet is thick at low load and thin at high load, and the thin case is where riders wait longest. A policy that only helps in the thin case helps exactly where it matters. The price is a p95 match latency that roughly doubles. For a taxi that is a fair trade for about 250 m less driving per pickup. For a service that has to answer fast it would not be.',
      },
      { type: 'paragraph', html: 'Five things I would not claim from this:' },
      {
        type: 'list',
        items: [
          '<strong>That I built DiDi\'s system.</strong> My score is a distance. Their first stage is a learned model of whether a human driver takes the job, and I deleted it because my cars cannot refuse. I implemented their optimiser, and their 84.4% success rate is not a number my result can be compared with.',
          '<strong>That it wins every batch.</strong> The hill climb maximises a distance score, not mean distance, and a swap can leave one request without a car. At 32 requests against 40 free cars it was 10.8% better overall and still worse than greedy on 43 of 300 batches, 41 of them because it matched one rider fewer. Most batched live rows are a single run, so a gap of a percent or two between two batched rows is inside the noise.',
          '<strong>That it adds capacity.</strong> The project report concluded that at 3,000 requests a second the limit is the number of cars, though my instrumentation could not cleanly separate the two possible causes. Batching sends the cars I have to better places. It does not make more of them.',
          '<strong>Anything about a real network.</strong> Every run in this post was on one laptop with no network between tiers. Greedy sends its lookups in groups of up to eight and the batched arm in groups of up to 64, so a real hop to the state service would be spread over more requests by the batched arm. I expect the trade looks better with a network in the path, but I have not measured it.',
          '<strong>Anything about clustered demand.</strong> Requests and cars are spread evenly over the box. Real demand clusters, and I did not test that.',
        ],
      },
      { type: 'heading', level: 2, text: 'References' },
      {
        type: 'list',
        items: [
          'Zhang, L. et al. (2017). <a href="https://doi.org/10.1145/3097983.3098138" target="_blank" rel="noopener noreferrer"><em>A Taxi Order Dispatch Model based On Combinatorial Optimization</em></a>. KDD \'17, Halifax, Canada.',
          'Eom, M. and Toriello, A. (2026). <a href="https://doi.org/10.1287/msom.2024.1074" target="_blank" rel="noopener noreferrer"><em>Batching and Greedy Policies: How Good Are They in Dynamic Matching?</em></a> Manufacturing &amp; Service Operations Management 28(2). I read the author manuscript dated 26 August 2025, so the quoted figures are the manuscript\'s.',
        ],
      },
      {
        type: 'paragraph',
        html:
          '<a href="/writing/sit314-batched-assignment/paper.pdf" target="_blank" rel="noopener noreferrer">Read the full paper (PDF)</a>. It is the paper as submitted, so a few points this post corrects are still in it.',
      },
    ],
  },
  {
    slug: 'rlig-reinforcement-learning-bayesian-networks',
    title: 'RLiG: learning Bayesian network structure with reinforcement learning, and the reward that did not pay for itself',
    date: '2026-10-04',
    readMin: 17,
    tags: ['algorithms', 'reinforcement-learning', 'bayesian-networks', 'python', 'sit320'],
    excerpt:
      'I built an agent that learns the shape of a Bayesian network by editing it one edge at a time, with a reward that mixes BIC with how well the network generates data. With the generative half switched off, my linear agent beat hill climbing on five of six networks. The generative reward mostly did not help.',
    featured: true,
    content: [
      {
        type: 'paragraph',
        dropCap: true,
        html:
          'RLiG learns the structure of a Bayesian network with reinforcement learning. An agent edits a graph one edge at a time, and its reward mixes the usual BIC score with a second score for how well the learned network generates data. That second score is expensive, so the agent only pays for it at chosen steps. I wrote this up as the High Distinction task for <strong>SIT320 Advanced Algorithms</strong> at Deakin in T2 2026. This post is that paper, shortened, with the marking parts taken out.',
      },
      {
        type: 'paragraph',
        html:
          'The unit\'s task sheet set the RLiG problem: the hybrid reward, the tiles and the baselines. My part was the implementation, the difference-form reward, the β calibration, the agents and the experiments.',
      },
      {
        type: 'paragraph',
        html:
          'The headline is a negative result, and I think it is the most useful part. The expensive half of the reward, which is the part I could not find in the literature, mostly did not help. What did well was the linear agent with the generative half switched off.',
      },
      { type: 'heading', level: 2, text: 'The problem' },
      {
        type: 'paragraph',
        html:
          'A Bayesian network is a directed acyclic graph (a DAG) over some variables, plus a probability table for each variable given its parents. Learning the structure means finding the graph from data. The normal way is a greedy search over DAGs: add, delete or reverse whichever edge improves a score like BIC the most, and stop when nothing improves it. Nothing but the score guides it.',
      },
      {
        type: 'paragraph',
        html:
          'RLiG changes two things. It turns the search into a sequential decision problem, so an edit can be worth making even when it lowers the score right now. And it adds a second term that asks how good the network is at the job it often gets built for, which is generating realistic data.',
      },
      { type: 'heading', level: 2, text: 'The decision process' },
      {
        type: 'paragraph',
        html:
          'Given <em>N</em> rows of discrete data over <em>d</em> variables:',
      },
      {
        type: 'list',
        items: [
          '<strong>State.</strong> The current DAG as a boolean adjacency matrix, the position inside the tile (<em>t</em> mod <em>L</em>), and a few summary numbers: BIC per row, edge count, progress through the episode, in-degree, a stall counter, the last measured generative score and how much of the generative budget is spent.',
          '<strong>Actions.</strong> (op, <em>i</em>, <em>j</em>) with op one of add, delete or reverse, so 3<em>d</em><sup>2</sup> in the raw encoding. An action is legal only if the graph stays acyclic and no node gets more than <em>k</em> parents.',
          '<strong>Episodes</strong> end after <em>T</em> edits, or after 15 steps with no BIC improvement.',
        ],
      },
      {
        type: 'paragraph',
        html:
          'Write BIC<sub><em>N</em></sub> for BIC divided by the number of rows, and Gen(<em>G</em>) for the generation score, which sits between 0 and 1. The hybrid score is:',
      },
      {
        type: 'equation',
        html: '<em>H</em>(<em>G</em>) = α · BIC<sub><em>N</em></sub>(<em>G</em>) + β · Gen(<em>G</em>)',
      },
      {
        type: 'paragraph',
        html:
          'At an ordinary step the reward is just the change in α · BIC<sub><em>N</em></sub>. At a generative step it also adds β times the change in Gen since the last generative step, because Gen was never measured on the graph in between.',
      },
      { type: 'heading', level: 3, text: 'Why the reward is a difference' },
      {
        type: 'paragraph',
        html:
          'With no discounting (γ = 1) a difference reward telescopes. Add up every step and the BIC part collapses to the change from the first graph to the last. So maximising the return is close to maximising the hybrid score of the final graph. That is the whole reason to use RL here. An edit that lowers the score is allowed, it just has to be paid back before the episode ends, and a greedy hill climber cannot do that at all. A test in the notebook checks this identity to six decimal places.',
      },
      {
        type: 'paragraph',
        html:
          'It is not quite the clean <em>H</em>(<em>G<sub>T</sub></em>) − <em>H</em>(<em>G</em><sub>0</sub>), for two reasons. Gen is never measured on the starting graph, so the first measured graph becomes the baseline. And with tiles, the generative part only telescopes between generative steps.',
      },
      { type: 'heading', level: 3, text: 'Tiles, and what they save' },
      {
        type: 'paragraph',
        html:
          'Step <em>t</em> is generative when <em>t</em> mod <em>L</em> is in a set <em>I<sub>g</sub></em>. With <em>L</em> = 5, <em>I<sub>g</sub></em> = {0} and <em>T</em> = 40, an episode schedules eight simulate-and-compare calls instead of forty. A cheap step is a cached BIC change for each legal action, while a generative step also has to fit the probability tables, simulate <em>N<sub>s</sub></em> rows and compare them with real data. I timed both.',
      },
      {
        type: 'image',
        src: '/writing/sit320-rlig/cost.webp',
        alt: 'Bar chart of milliseconds per environment step on six networks, on a log scale. Cheap steps sit well below generative steps at 200, 1000 and 5000 simulated rows.',
        caption: 'Milliseconds per environment step, log scale. Grey is a cheap BIC-only step, the coloured bars are generative steps at three simulation sizes.',
        lightBg: true,
      },
      {
        type: 'chart',
        kind: 'bar',
        title: 'A generative step costs 4.5 to 12.9 times a cheap one',
        subtitle: 'Milliseconds per step, simulating 1,000 rows',
        unit: 'ms',
        categories: ['synthetic', 'asia', 'sachs', 'child', 'insurance', 'alarm'],
        series: [
          { name: 'Cheap step', values: [0.06, 0.05, 0.08, 0.16, 0.29, 0.77] },
          { name: 'Generative step', values: [0.71, 0.52, 0.81, 2.02, 2.44, 3.51] },
        ],
      },
      {
        type: 'table',
        headers: ['Network', 'd', 'Cheap step (ms)', 'Generative step (ms)', 'Ratio'],
        rows: [
          ['synthetic', '10', '0.06', '0.71', '12.0×'],
          ['asia', '8', '0.05', '0.52', '10.5×'],
          ['sachs', '11', '0.08', '0.81', '10.5×'],
          ['child', '20', '0.16', '2.02', '12.9×'],
          ['insurance', '27', '0.29', '2.44', '8.3×'],
          ['alarm', '37', '0.77', '3.51', '4.5×'],
        ],
      },
      {
        type: 'paragraph',
        html:
          'Those timings use <em>N<sub>s</sub></em> = 1000. The main runs simulate 5000 rows, where the ratio reaches 36× on Child. That ratio shrinks on the widest network because a cheap step has to score every legal edit, and ALARM has a lot of them. Tiling therefore pays best on smaller networks and big simulations.',
      },
      { type: 'heading', level: 2, text: 'The two halves of the score' },
      {
        type: 'paragraph',
        html:
          'BIC splits into one term per variable and its parents. That split is the only reason any of this runs fast, because an edit touches one family (two for a reversal) and every family score is cached:',
      },
      {
        type: 'equation',
        html:
          'BIC(<em>G</em>) = Σ<sub><em>i</em></sub> [ Σ<sub><em>j</em>,<em>k</em></sub> <em>N<sub>ijk</sub></em> log(<em>N<sub>ijk</sub></em> / <em>N<sub>ij</sub></em>) − (log <em>N</em> / 2) · <em>q<sub>i</sub></em>(<em>r<sub>i</sub></em> − 1) ]',
        caption: 'Higher is better, in nats. The penalty is Schwarz (1978). The per-family form follows de Campos (2006).',
      },
      {
        type: 'paragraph',
        html:
          'Gen(<em>G</em>) fits every probability table on the training rows with a Dirichlet prior of 1, simulates <em>N<sub>s</sub></em> rows, and compares the one-way and two-way marginals against a held-out reference split using Jensen-Shannon divergence in bits (Lin, 1991). Its value is 1 minus the average divergence. JS in bits is bounded by 1, so Gen stays between 0 and 1 whatever the number of variables. I hold the reference split out on purpose. Scoring a simulation against the rows its own tables were fitted to would reward a graph for copying noise.',
      },
      { type: 'heading', level: 3, text: 'Calibrating β' },
      {
        type: 'paragraph',
        html:
          'The two halves turned out to be about two orders of magnitude apart, which I did not expect. On ASIA at 500 rows, going from the empty graph to hill climbing\'s graph moves BIC<sub><em>N</em></sub> by about 0.65 and Gen by about 0.0062. At α = β = 1 the generative term would do nothing, and a sweep over β would look like it measured something when it did not. For each dataset I set:',
      },
      {
        type: 'equation',
        html:
          'β* = [ BIC<sub><em>N</em></sub>(<em>G</em><sub>hc</sub>) − BIC<sub><em>N</em></sub>(∅) ] / [ Gen(<em>G</em><sub>hc</sub>) − Gen(∅) ]',
        caption: 'The β at which one unit of movement in each half is worth the same.',
      },
      {
        type: 'paragraph',
        html:
          'Every run quotes β as a multiple ρ of that. ρ = 1 is balanced by construction, and I fixed it before looking at any result. The ρ = 0 rows were added after the sweep, once ρ = 0 kept doing better. β* comes out at about 104 on ASIA and about 1837 on ALARM, which is why a raw β cannot carry across networks but ρ can.',
      },
      { type: 'heading', level: 2, text: 'Three agents' },
      {
        type: 'list',
        items: [
          '<strong>Tabular Q-learning</strong> (Watkins and Dayan, 1992), keyed on the graph bytes and the tile position. Exact, and only feasible while the table stays small.',
          '<strong>Linear Q</strong> over fifteen hand-built features. Anything that is the same for every action in a state cannot change which action wins, so state variables only appear multiplied by something that varies, like the BIC change of that action.',
          '<strong>A DQN</strong> (Mnih et al., 2015) with learned embeddings for <em>i</em>, <em>j</em> and the operator, so one network covers any edit at any graph width. Illegal actions are masked before the argmax and before the bootstrap max (Huang and Ontañón, 2022), so it never has to learn acyclicity.',
        ],
      },
      {
        type: 'paragraph',
        html:
          'The BIC change is an input feature for both learned agents on purpose. RLiG only has to learn when following the score is the wrong move. I expected uniform exploration to waste steps, since a sparse ALARM graph offers roughly thirteen hundred legal edits, so RLiG explores with a Boltzmann draw over the BIC change. In the small two-seed ablation, uniform was actually ahead on ASIA and Child, so that choice is untested.',
      },
      {
        type: 'paragraph',
        html:
          'One episode, as pseudocode:',
      },
      {
        type: 'code',
        lang: 'text',
        label: 'RLiG, one episode',
        code: `G <- init()                          # empty, random, or a hill-climb warm start
for t = 0 .. T-1:
    A <- feasible_edits(G)           # cycle and in-degree masks off one closure
    D <- bic_deltas(G, A)            # cached local scores, two for a reversal
    a <- policy(s_t, A, D)           # argmax on Q, Boltzmann on D when exploring
    G' <- apply(a, G)
    if (t mod L) in I_g:             # or the meta-head says spend, and budget remains
        r <- alpha*dBIC_N + beta*(Gen(G')-g_last)  # N_s rows from G', compare
        remember (H(G'), G')         # only measured graphs can be the answer
    else:
        r <- alpha * (BIC_N(G') - BIC_N(G))
    update(s_t, a, r, s_{t+1});  G <- G'
return the graph with the best measured H`,
      },
      {
        type: 'paragraph',
        html:
          'The last line matters more than it looks. Only graphs seen at a generative step can be returned, so with <em>L</em> = 5 the answer comes from one in five of the graphs visited.',
      },
      { type: 'heading', level: 2, text: 'Setup' },
      {
        type: 'paragraph',
        html:
          'Five discrete benchmark networks from the <a href="https://www.bnlearn.com/bnrepository/" target="_blank" rel="noopener noreferrer">bnlearn Bayesian Network Repository</a> (Scutari), plus one synthetic network with a known true graph. None of it is real-world data. Each network gets one sampled dataset: 500 rows to fit the tables and the BIC, 2000 as the reference for Gen, and 5000 held out for the final metrics only. 500 training rows is deliberate. With 5000 rows BIC is close to consistent on these networks and a second objective has little left to add.',
      },
      {
        type: 'table',
        headers: ['Network', 'Variables', 'Arcs', 'Max parents', 'β*'],
        rows: [
          ['synthetic', '10', '12', '3', '166'],
          ['asia (Lauritzen and Spiegelhalter, 1988)', '8', '8', '2', '104'],
          ['sachs (Sachs et al., 2005)', '11', '17', '3', '145'],
          ['child', '20', '25', '2', '523'],
          ['insurance (Binder et al., 1997)', '27', '52', '3', '1016'],
          ['alarm (Beinlich et al., 1989)', '37', '46', '4', '1837'],
        ],
      },
      {
        type: 'paragraph',
        html:
          'The in-degree cap is <em>k</em> = 3. ALARM has a node with four parents, so its true graph is out of reach for every capped method, and a non-zero error is forced there.',
      },
      {
        type: 'paragraph',
        html:
          'I wrote all four baselines myself, because the searchers are the thing being compared: hill climbing on BIC, the same with a tabu list, GES following Chickering (2002) with Meek\'s orientation rules (Meek, 1995), and PC with a G² test (Spirtes et al., 2000). My GES has two stated deviations from Chickering. It only enumerates subsets up to size three, and its delete step respects the in-degree cap. My notebook has 55 tests that run in 2.4 seconds. They include checking the action masks against applying every edit for real, and checking the equivalence-class code against every DAG on three, four and five nodes, which is 29281 graphs at five.',
      },
      {
        type: 'paragraph',
        html:
          'Structure is scored as structural Hamming distance (SHD) on the equivalence class, the way Tsamardinos et al. (2006) define it. A reversed edge that the data cannot tell apart costs nothing. Lower is better. Each learned agent runs ten seeds. One dataset is drawn per network and every method sees the same draw, so a seed changes the agent and not the data.',
      },
      { type: 'heading', level: 2, text: 'Results' },
      {
        type: 'paragraph',
        html:
          'SHD on the equivalence class, mean ± one standard deviation over ten seeds where it varies. ρ = 1 is the hybrid reward. ρ = 0 switches the generative half off.',
      },
      {
        type: 'table',
        headers: ['Network', 'Hill climb', 'GES', 'PC', 'Linear, ρ=0', 'Linear, ρ=1', 'DQN, ρ=0'],
        rows: [
          ['synthetic', '5.0', '4.0', '11.0', '1.0', '2.7 ± 2.3', '1.0'],
          ['asia', '4.0', '5.0', '8.0', '1.0', '3.4 ± 2.2', '1.0'],
          ['sachs', '5.0', '13.0', '7.0', '13.0', '7.2 ± 2.6', '13.0'],
          ['child', '18.0', '13.0', '21.0', '13.0', '12.4 ± 1.6', '20.3 ± 3.7'],
          ['insurance', '40.0', '36.0', '46.0', '35.2 ± 1.0', '37.7 ± 4.5', '51.2 ± 3.6'],
          ['alarm', '41.0', '31.0', '34.0', '36.4 ± 2.7', '41.5 ± 3.8', '47.8 ± 2.6'],
        ],
      },
      {
        type: 'paragraph',
        html:
          '<strong>With the generative half off, the linear agent is the best structure learner in the table on three of six networks</strong>, sharing first place with the DQN on two of them. On the synthetic network and ASIA it hits SHD 1.0 on every seed, where hill climbing and GES are four or five off. Its ASIA graph even has a better BIC than the true graph, −1107 against −1110. Insurance goes its way too, 35.2 against 36.0 for GES, but that gap is smaller than its own seed spread.',
      },
      {
        type: 'paragraph',
        html:
          'It does not come first on the other three: it loses ALARM and Sachs and ties Child. On ALARM, GES is clearly ahead at 31.0, and that is the one clean win for equivalence-class search here. Child ends in a tie: the agent lands in GES\'s equivalence class on every seed, same BIC and same SHD of 13.0. Child is also the one place the hybrid at ρ = 1 beats every other method, 12.4 against 13.0, but that is inside its spread and beats 13 on only four seeds of ten, so I would not lean on it.',
      },
      {
        type: 'paragraph',
        html:
          'On Sachs, hill climbing gets SHD 5.0 at a BIC of −4066. GES and the ρ = 0 agent both find the better BIC of −4062 and both land on 13.0. Two unrelated searches reaching a better score and the same worse graph points at the score itself at this sample size, though it does not prove they returned the same graph. Here the ρ = 1 runs do better, 7.2 ± 2.6 for the linear agent and 8.4 ± 3.2 for the DQN, against 13.0 on every seed at ρ = 0. That gap is larger than the seed spread, so it is the one clear structural gain from the generative half, and it cuts against my headline. My ρ sweep did not cover Sachs, so I cannot say much more.',
      },
      {
        type: 'paragraph',
        html:
          '<strong>The DQN is the weakest agent, and it loses on the wide networks.</strong> At ρ = 0 it matches the linear agent on the three smallest, then falls to 51.2 on Insurance and 47.8 on ALARM. ALARM gives it about 13000 gradient steps for about 15000 parameters, and its bootstrap target only looks at a shortlist of 24 actions out of about 1300. Both are fixable with compute. The linear agent\'s fifteen features may also be a strong built-in bias that happens to land close to right, and I cannot tell how much of the gap that explains.',
      },
      { type: 'heading', level: 3, text: 'Learning curves' },
      {
        type: 'image',
        src: '/writing/sit320-rlig/curves.webp',
        alt: 'Two line charts of greedy episode return against training episode for ASIA and Child, for tabular, linear and DQN agents, with shaded bands for one standard deviation.',
        caption: 'Greedy return against training episode, mean and one standard deviation over ten seeds. Each point comes from a separate greedy evaluation episode, so decaying exploration cannot pass for learning.',
        lightBg: true,
      },
      {
        type: 'paragraph',
        html:
          'By episode 100 the tabular curve on ASIA has climbed to about 1.10, and after that it barely moves. Tabular finishes highest on both, but its table grows fast: about 490 distinct states on ASIA against about 4800 on Child, so it will not scale far past that.',
      },
      { type: 'heading', level: 2, text: 'Does the generative half help?' },
      {
        type: 'paragraph',
        html:
          'I swept ρ from 0 to 4 on three networks with two agents, ten seeds each, to find out.',
      },
      {
        type: 'image',
        src: '/writing/sit320-rlig/rho.webp',
        alt: 'Six panels sweeping rho from 0 to 4 on ASIA, Child and the synthetic network. The top row shows SHD rising with rho for most curves. The bottom row shows held-out log-likelihood.',
        caption: 'Sweeping ρ, where β = ρ · β*. Top row SHD (lower is better), bottom row held-out log-likelihood per row (higher is better), one standard deviation over ten seeds.',
        lightBg: true,
      },
      {
        type: 'paragraph',
        html:
          'Mostly it does not. Four of the six curves have their best SHD at ρ = 0. Both exceptions are Child: the linear agent is flat and noisy across the whole range, 11.3 to 13.9, and the DQN\'s best point sits inside its own ρ = 0 spread. Two-way JS is the thing the generative half is meant to improve. Five of six curves do best above zero, but no gap clears the seed spread.',
      },
      {
        type: 'paragraph',
        html:
          'I expected a trade-off, with better generation bought with worse structure. One seed at a smaller budget seemed to show it. Ten seeds did not.',
      },
      { type: 'heading', level: 3, text: 'Why the marginal score is too flat' },
      {
        type: 'paragraph',
        html:
          'Gen averages divergences over one-way and two-way marginals, and many different graphs reproduce those about equally well. On ASIA its whole range between the empty graph and hill climbing\'s graph is about 0.0062. Re-running the whole grid at five times the simulated rows only widened that from 0.0045, while a generative step on ASIA went from 10.5 to 32.0 times the cost of a cheap one. So the problem is more what Gen measures than how precisely it is measured.',
      },
      { type: 'heading', level: 3, text: 'Tiling' },
      {
        type: 'table',
        headers: ['Network', 'No tiles (BIC only)', 'L = 5, every 5th step', 'Every step', 'Learned tiler'],
        rows: [
          ['asia', '2.7 (0 sims)', '6.7 (1929)', '4.5 (8689)', '8.5 (1538)'],
          ['child', '19.1 (0)', '23.4 (2479)', '19.5 (11326)', '23.0 (2056)'],
          ['synthetic', '2.0 (0)', '2.8 (1933)', '3.1 (8267)', '5.7 (1577)'],
        ],
      },
      {
        type: 'paragraph',
        html:
          'SHD with the number of simulate-and-compare calls in brackets, DQN, ten seeds. Tiling works as a cost control, since <em>L</em> = 5 spends 22 to 23 percent of what evaluating every step spends. On structure, that tile beats evaluating every step on only one of three networks. The BIC-only control, at zero generative cost, has the best SHD on all three, though on Child it only ties the best tiling, 19.1 against 19.2 with two generative steps per tile. On held-out likelihood it loses to tiling on all three.',
      },
      {
        type: 'paragraph',
        html:
          'I also built a learned tiler: a second head that decides at each step whether to spend one of the episode\'s generative evaluations, capped at the same budget as the fixed tile. Against that fixed tile it was better on Child by 0.4 SHD, worse on the other two, and worse on held-out likelihood on all three. I read that as a result about my controller rather than about learned tiling in general, because the two heads share a return and never coordinate.',
      },
      { type: 'heading', level: 3, text: 'Ablations' },
      {
        type: 'paragraph',
        html:
          'These ablations are DQN runs, two seeds each. I expected exploration to matter most, and it did not. Summed over the three networks, two changes hurt most: dropping the BIC change from the action features, which cost 3.0, 12.0 and 7.0 SHD on ASIA, Child and the synthetic network, and switching to the level-form reward, which cost 3.0, 12.5 and 3.5. Warm-starting from hill climbing and setting γ = 0.9 both helped on Child, 15.0 against 25.5. These are two seeds each, so read them as sketches.',
      },
      {
        type: 'paragraph',
        html:
          'The BIC-feature result also means the DQN is mostly learning how much weight to give the structural score.',
      },
      { type: 'heading', level: 2, text: 'Two extensions: noise, and a better generative score' },
      { type: 'heading', level: 3, text: 'How much can noise in Gen hurt?' },
      {
        type: 'paragraph',
        html:
          'Gen is estimated from simulated rows, so the agent sees the true score plus some noise. If that noise is bounded by ε, the telescoping above leaves only two measured graphs in the return, so the return is off by at most 2βε. The level-form reward adds Gen at every generative step, so its error can reach <em>m</em>βε over <em>m</em> generative steps. At <em>L</em> = 5 and <em>T</em> = 40 that is four times worse. Two tests check both bounds on the real environment with made-up noise.',
      },
      {
        type: 'paragraph',
        html:
          'The returned graph is also picked as the maximum of noisy scores, so its recorded score should be optimistic on average. Graphs whose noise came out high are the ones that win, and the runs below confirm that.',
      },
      {
        type: 'paragraph',
        html:
          'For the discriminator score below, Hoeffding\'s inequality (Hoeffding, 1963) with a union bound over <em>K</em> scored graphs gives a size for part of that noise. It leaves out the noise from training the classifier and from which real rows it is tested on:',
      },
      {
        type: 'equation',
        html: 'ε = √( ln(2<em>K</em>/δ) / (2<em>m</em>) )',
        caption: 'm is the number of held-out simulated rows, K the graphs scored in a run, 1 − δ the probability.',
      },
      {
        type: 'paragraph',
        html:
          'At 1000 rows, <em>K</em> = 2000 and δ = 0.05, that gives ε = 0.0751. Getting it to 0.01 would take 56449 rows. The discriminator score gets its own β*, about 3 on ASIA. With that, 2βε is 0.461, most of the 0.65 gap between hill climbing\'s graph and the empty one. As a guarantee it says little at this size.',
      },
      { type: 'heading', level: 3, text: 'A learned discriminator in place of the marginal score' },
      {
        type: 'paragraph',
        html:
          'MMD-GAN (<a href="https://arxiv.org/abs/1705.08584" target="_blank" rel="noopener noreferrer">Li et al., 2017</a>) swaps a fixed kernel for one learned adversarially, so the test looks wherever two samples differ most. I took the simplest form of that idea, a classifier two-sample test (<a href="https://arxiv.org/abs/1610.06545" target="_blank" rel="noopener noreferrer">Lopez-Paz and Oquab, 2017</a>). Simulate rows from the graph, train a small network to tell them from real rows, and test it on rows it never saw. If it cannot tell them apart, the graph generates well. The score is 1 minus the gap between the classifier\'s average output on real and simulated test rows.',
      },
      {
        type: 'paragraph',
        html:
          'This score is sharper. Against held-out likelihood it ranks graphs better on all three test networks, with rank correlations of 0.90, 0.93 and 0.95 against 0.80, 0.77 and 0.86 for the marginal score. Speed is the catch: about 30 ms per score against 1.3 to 5.0 ms, because every score is a small training run.',
      },
      {
        type: 'table',
        headers: ['Network, agent', 'ρ = 0', 'Marginal, ρ = 1', 'Discriminator, ρ = 1'],
        rows: [
          ['synthetic, linear', '1.0', '2.7 ± 2.3', '0.0'],
          ['synthetic, DQN', '1.0', '2.8 ± 1.3', '2.3 ± 2.1'],
          ['asia, linear', '1.0', '3.4 ± 2.2', '2.6 ± 1.4'],
          ['asia, DQN', '1.0', '6.7 ± 1.8', '5.3 ± 2.6'],
          ['child, linear', '13.0', '12.4 ± 1.6', '12.8 ± 3.0'],
          ['child, DQN', '20.3 ± 3.7', '23.4 ± 3.9', '23.8 ± 1.6'],
        ],
      },
      {
        type: 'paragraph',
        html:
          'Across the 12 cells (three networks, two agents, ρ = 1 and 4), the discriminator gets the better mean SHD than the marginal score in 8 and the better held-out likelihood in 9. The clearest case is the synthetic network with the linear agent: at ρ = 1 it lands in the true equivalence class on all ten seeds. Child with the linear agent at ρ = 4 also beats ρ = 0, 12.0 against 13.0. But on ASIA and for the DQN, ρ = 0 still wins on structure. Part of the problem was the score, then, and part of it was not.',
      },
      {
        type: 'paragraph',
        html:
          'Optimism shows up as predicted. Rescoring the returned graph five more times gives a lower average than the recorded score in every row where Gen has weight, and no clear gap in any ρ = 0 row.',
      },
      { type: 'heading', level: 2, text: 'Limits' },
      {
        type: 'list',
        items: [
          'Seed variance is large. On 16 of the 20 rows that vary at all, the standard deviation over ten seeds is wider than the gap to the nearest other method. For the linear agent at ρ = 1 on ALARM, SHD ranges from 32 to 47 across seeds.',
          'ALARM\'s numbers are relative, since <em>k</em> = 3 puts its true graph out of reach.',
          'Ablations and the sample-size study are two seeds each.',
          'Episode counts were set to fit a runtime budget, and the runs may not have converged. Nothing was tuned, and a tuned DQN might close some of the gap.',
          'My literature search did not find anyone putting simulation fidelity in the reward. Reinforcement learning over DAGs is not new, and paying for an expensive reward only sometimes has been studied (<a href="https://arxiv.org/abs/2011.06709" target="_blank" rel="noopener noreferrer">Krueger et al., 2020</a>). A search that finds nothing is weak evidence, so I treat the hybrid objective as new only modestly.',
        ],
      },
      { type: 'heading', level: 2, text: 'What I took from it' },
      {
        type: 'paragraph',
        html:
          'The part I would keep is the sequential framing. With ρ = 0 the linear agent beat hill climbing on five of six networks, and the DQN beat it on two. My reading is that an agent that keeps editing past the first move that fails to improve the score (for up to 15 such steps) can walk through the point where a greedy search stops, and sometimes climbs out the other side.',
      },
      {
        type: 'paragraph',
        html:
          'Nothing in my grid varied <em>T</em>, though, so that reading is still untested. Sweeping the edit budget is the experiment I would run next.',
      },
      { type: 'heading', level: 2, text: 'Papers this builds on' },
      {
        type: 'list',
        items: [
          'Schwarz (1978), the BIC penalty. de Campos (2006), the per-family BIC form.',
          'Cooper and Herskovits (1992) and Heckerman, Geiger and Chickering (1995), Dirichlet priors for the probability tables.',
          'Chickering (2002), GES and equivalence classes. Meek (1995), orientation rules.',
          'Tsamardinos, Brown and Aliferis (2006), SHD on the equivalence class.',
          'Spirtes, Glymour and Scheines (2000), the PC algorithm.',
          'Sutton and Barto (2018). Watkins and Dayan (1992), Q-learning. Mnih et al. (2015), DQN. Huang and Ontañón (2022), invalid action masking.',
          'Lin (1991), Jensen-Shannon divergence. Gretton et al. (2012), MMD.',
          'Hoeffding (1963), the concentration bound.',
          '<a href="https://arxiv.org/abs/1610.06545" target="_blank" rel="noopener noreferrer">Lopez-Paz and Oquab (2017)</a>, classifier two-sample tests. <a href="https://arxiv.org/abs/1705.08584" target="_blank" rel="noopener noreferrer">Li et al. (2017)</a>, MMD-GAN.',
          '<a href="https://arxiv.org/abs/2011.06709" target="_blank" rel="noopener noreferrer">Krueger, Leike, Evans and Salvatier (2020)</a>, rewards observed at a cost.',
          'Networks from the <a href="https://www.bnlearn.com/bnrepository/" target="_blank" rel="noopener noreferrer">bnlearn repository</a>: ASIA (Lauritzen and Spiegelhalter, 1988), Sachs (Sachs et al., 2005), Insurance (Binder et al., 1997), ALARM (Beinlich et al., 1989) and Child.',
        ],
      },
      {
        type: 'paragraph',
        html:
          '<a href="/writing/sit320-rlig/paper.pdf" target="_blank" rel="noopener noreferrer">Read the full paper (PDF)</a>. It has every table, the ablations, posterior predictive checks and the full reference list.',
      },
    ],
  },
  {
    slug: 'where-is-the-algorithm',
    title: 'Where Is the Algorithm? Two tic-tac-toe players and what they mean for teaching algorithms',
    date: '2026-09-25',
    readMin: 21,
    tags: ['algorithms', 'reinforcement-learning', 'dynamic-programming', 'teaching', 'sit320'],
    excerpt: 'I built two tic-tac-toe players, one solved by dynamic programming and one that learned by playing 200,000 games. Both end as tables nobody typed. I argue that "the algorithm" depends on the level you describe a system at, give a three-part test for which run-time state belongs to it, and propose a two-hour lab I have not yet run with a class.',
    featured: true,
    content: [
      {
        type: 'paragraph',
        html: 'I built two tic-tac-toe players. One solves the game by dynamic programming. The other learns it by playing 200,000 games and never sees a model of the game at all. Both finish as a table of numbers I did not type, and neither contains a rule anyone wrote about where to open. That is the puzzle people raise about language models and learned agents, sitting inside an exercise from an undergraduate algorithms unit.',
        dropCap: true,
      },
      {
        type: 'paragraph',
        html: 'I wrote this as the High Distinction position paper for <strong>SIT320 Advanced Algorithms</strong> at Deakin in T2 2026. I shaped it as a computing education research paper, then decided to publish it here myself rather than send it to a conference. This post is the paper, shortened. The full PDF is linked at the end.',
      },
      {
        type: 'paragraph',
        html: 'My answer is that "the algorithm" is relative to a level of description. Relative to the generic executor, the table a player reads is input. Relative to the deployed player, that table is part of the procedure that runs. The boundary I draw runs between a generic executor and the persistent state it reads, and whether a person or a training run wrote that state makes no difference to it. That boundary is already inside dynamic programming.',
      },
      { type: 'heading', level: 2, text: 'The questions' },
      {
        type: 'paragraph',
        html: 'The overall question is where the word "algorithm" points in a learned system, and what an algorithms unit should do about it. I split it into three research questions.',
      },
      {
        type: 'list',
        items: [
          '<strong>RQ1.</strong> At which levels of description can "the algorithm" name a part of a learned system, and what does it name at each level?',
          '<strong>RQ2.</strong> Which run-time state belongs to a deployed algorithm, and does it matter whether a person wrote that state?',
          '<strong>RQ3.</strong> What should an undergraduate algorithms unit change because of the answers, and how could the change be tested?',
        ],
      },
      {
        type: 'paragraph',
        html: 'The method is conceptual analysis. I state candidate answers and test each one against a fixed set of cases, against five conditions I set out before the analysis, and against what the two players actually printed. None of the conditions fixes which verdict an answer has to reach. They ask, for example, that an answer give a verdict on two bit-identical tables run by the same executor, one fitted and one typed, and that it say where it stops.',
      },
      { type: 'heading', level: 2, text: 'What has already been argued' },
      {
        type: 'paragraph',
        html: 'Some of what I might have claimed as news was argued twenty years ago. Blass and Gurevich (2003) survey the attempts at an absolute definition and say "the notion of algorithm is richer these days than it was in Turing\'s days". Gurevich (2012) puts it harder: "the notion of algorithm cannot be rigorously defined in full generality, at least for the time being". Moschovakis (2001) argues that algorithms are recursive definitions, while machines model implementations. So the claim that the classical definition is incomplete belongs to them, and none of their reasons is machine learning. My part is narrower. I ask where the word points inside a running learned system, and what a curriculum should do about it.',
      },
      {
        type: 'paragraph',
        html: 'Wegner (1997) argued that interaction is more powerful than algorithms. <a href="https://doi.org/10.1093/comjnl/bxl062" target="_blank" rel="noopener noreferrer">Cockshott and Michaelson (2007)</a> replied to a later version of that argument that the input stream of an interactive run can be recorded and fed to an ordinary tape machine. I try to stay out of that fight by making a claim about description and not about computational power. Nothing here says a learned system computes a function no Turing machine can.',
      },
      {
        type: 'paragraph',
        html: 'In computing education, <a href="https://doi.org/10.1145/1067445.1067467" target="_blank" rel="noopener noreferrer">Perrenet, Groote and Kaasenbrood (2005)</a> describe four levels at which students think about the concept of algorithm, from one run on a concrete machine up to a black box chosen for a problem. None of the four has a place for state that is neither the program nor an input and that every run reads. <a href="https://doi.org/10.1145/3571785.3574125" target="_blank" rel="noopener noreferrer">Lonati and colleagues (2022)</a> leave out, on purpose, programs whose logic is "machine produced" and, following Janlert, call them "dark". This paper takes up the case they scoped out. The level split itself goes back to <a href="https://doi.org/10.1093/mind/LIX.236.433" target="_blank" rel="noopener noreferrer">Turing (1950)</a>, who wrote that the rules which change in a learning machine "are of a rather less pretentious kind, claiming only an ephemeral validity".',
      },
      { type: 'heading', level: 2, text: 'Two players for the same game' },
      {
        type: 'paragraph',
        html: 'Tic-tac-toe has 5478 reachable board positions. Of those, 2423 are unfinished with X to move, and those are the states my players have to decide in. O has its own 2097. Every number below comes from my notebook\'s saved output, and every win rate is exact, scored over the whole game graph rather than counted from sample games.',
      },
      {
        type: 'paragraph',
        html: '<strong>The solved player</strong> treats the game as a Markov decision process, with the opponent folded into the transition probabilities. Value iteration converges in 9 sweeps, and the last sweep changes nothing. The empty board comes out at 0.994791666667, and a backward induction over the same graph in exact fractions gives exactly 191/192. Policy iteration, run separately, picks the same move as value iteration in all 2423 decision states. Against a uniformly random opponent this player wins 0.994792 of games and loses none. Against a perfect opponent every game is a draw.',
      },
      {
        type: 'paragraph',
        html: '<strong>The learned player</strong> is the tabular Q-learning of <a href="https://doi.org/10.1007/BF00992698" target="_blank" rel="noopener noreferrer">Watkins and Dayan (1992)</a>. It gets the legal moves, the board it lands on after each move and the result of each finished game, and it never sees a model of the game. I used a constant step size of 0.3, no discount, and an epsilon that starts at 1.0 and is multiplied by 0.99995 after every episode, ending at 0.00005. A win scores +1, a loss −1 and a draw 0. Both players break ties on the lowest cell index. After 200,000 episodes against a random opponent, its table covers 2420 of the 2423 decision states. It wins 0.989583 of games against that opponent, loses none, and draws every game against a perfect one. The whole run, including exact scoring of 100 checkpoints, took 0.9 seconds.',
      },
      {
        type: 'paragraph',
        html: 'Watkins and Dayan prove convergence for step sizes that shrink. Mine stayed at 0.3, so their theorem does not cover this run, and the evidence that the learner plays well is the exact scoring.',
      },
      {
        type: 'image',
        src: '/writing/sit320-where-is-the-algorithm/two-players.webp',
        alt: 'Table comparing the two players. Dynamic programming needs the whole model, works over and stores 5478 states, plays from a policy over 2423 states, takes 9 sweeps, wins 0.994792 against a random O and opens on a corner. Q-learning learns one game at a time, works over 2423 states, stores 2420, plays from its Q table, takes 200,000 episodes, wins 0.989583 and opens on the centre. Neither loses to a random or a perfect O.',
        caption: 'Table 1 from the paper. "Plays from" is what each player reads at move time.',
        lightBg: true,
      },
      {
        type: 'paragraph',
        html: 'They differ on the opening. The solved player opens on a corner, and all four corners are worth 191/192 against a random opponent. The learner\'s final table opens on the centre, which is worth 95/96. That choice never settled. The greedy policy opened on a corner at 21 of the 100 checkpoints I saved during training, 16 of them in the second half, and the centre is where the last checkpoint happened to land.',
      },
      {
        type: 'paragraph',
        html: 'Then the part I did not expect. The learner\'s greedy move matches an optimal move in 0.9059 of all 2423 decision states. Of the 109 decision states that come up when it plays a random opponent, 108 are optimal, and the one it gets wrong is the empty board, which is the centre opening again. Its values are much further out than its moves are. Over the 8622 legal state-action pairs in the states it stored, the gap between its Q values and the true ones has a mean of 0.3423 and a maximum of 1.157. Picking the largest of the legal entries survives a lot of error spread across them.',
      },
      {
        type: 'paragraph',
        html: 'The notebook also trained the learner on five more seeds, in a shorter setup of 100,000 episodes, and saved only summaries for those runs. Their win rate against the random opponent printed as 0.9885 ± 0.0013, and between them they opened on cells 1, 4 and 6, which are an edge, the centre and a corner. So the same learning procedure gave deployed players that open in three different places.',
      },
      { type: 'heading', level: 2, text: 'Three levels' },
      {
        type: 'paragraph',
        html: 'Most of the disagreement here is people meaning different things by the same word, so I fix my terms first. An <em>executor</em> is the execution procedure a program runs on, such as an interpreter, a virtual machine or the forward pass of a network. <em>Persistent control state</em> is state the executor reads to decide what to do. It outlives any one input and is read again on the next. A comparator passed into a sort is persistent control state. So are a parser table, a script fed to an interpreter, the policy a dynamic programming solver reads off its value table, and a weight vector.',
      },
      {
        type: 'paragraph',
        html: 'Whenever I write "the algorithm" I say which of three levels I mean.',
      },
      {
        type: 'list',
        items: [
          '<strong>Executor level.</strong> The algorithm is the generic machinery, and everything it reads is input.',
          '<strong>Deployed level.</strong> The algorithm is the particular procedure running on this task, executor and control state together.',
          '<strong>System level.</strong> The algorithm would be the whole arrangement, including the people and the feedback.',
        ],
      },
      {
        type: 'paragraph',
        html: 'The first two carry their weight as answers to where the algorithm is. The third gives no answer until it says where it stops.',
      },
      { type: 'heading', level: 2, text: 'Five places it could be' },
      {
        type: 'paragraph',
        html: '<strong>The learning procedure.</strong> Gradient descent, value iteration and Q-learning are classical algorithms in the full sense. Each stops on a rule you set, and you can state its complexity. But the same Q-learning update gave me a centre opener on the main run and an edge, a centre and a corner across the five shorter ones. So the learning procedure is an algorithm, and it is not the algorithm that plays.',
      },
      {
        type: 'paragraph',
        html: '<strong>The inference procedure.</strong> My move selector is a few lines in each player. It takes the largest entry among the legal cells and breaks ties on the lowest index. Handed a different table, either player plays differently, so the selector is not the whole answer. Strength is not always concentrated in the parameters either. AlphaGo Zero\'s raw network, picking its most probable move with no search, rated 3055 Elo against 5185 for the full system with Monte Carlo tree search (Silver et al., 2017). The competence there is split between a learned artefact and a procedure.',
      },
      {
        type: 'paragraph',
        html: '<strong>The parameters.</strong> At the executor level they are input, and at the deployed level they are part of the procedure. They are never the algorithm alone. A table with nothing to read it is an inert array.',
      },
      {
        type: 'paragraph',
        html: '<strong>The interaction between model and user.</strong> This can be written down as a loop, so it deserves a real answer. A chat with a model whose weights and prompt stay fixed is one run of a deployed algorithm, and the conversation so far is that run\'s input. A recommender that refits on your clicks is different. Every refit changes the control state, so a new deployed algorithm starts at each one, and the loop is the learning procedure running online with the user supplying its data.',
      },
      {
        type: 'paragraph',
        html: '<strong>All of it together.</strong> This sounds the most reasonable and I think it is the weakest. If the algorithm includes the model and the user, does it include the people who wrote the training data, the engineers who set the reward, or the electricity? Each of those changes the output if you change it, so a test built on causal influence has no way to exclude any of them.',
      },
      { type: 'heading', level: 2, text: 'The strongest objection' },
      {
        type: 'paragraph',
        html: 'A universal machine has a fixed transition procedure and reads a program off a tape. Change the tape and it computes a different function, but the tape is not part of the universal machine\'s algorithm. Inference code plus weights has exactly that shape. So, the objection goes, the weights are input to the inference algorithm, and classical theory already has every word it needs.',
      },
      {
        type: 'paragraph',
        html: 'I think that is right at the executor level, and it kills a tempting move. The move says that swapping the weights changes the output, so the weights are part of the algorithm. That proves too much. Swap the comparator in a sort, the tape in a universal machine or the table in a table-driven parser, and each computes something different. If determining the output made a thing part of the procedure, the input would be part of the algorithm too.',
      },
      {
        type: 'paragraph',
        html: 'The compilation analogy, that weights are like machine code, runs the wrong way as well, because machine code is not part of the CPU. It does show that being found by optimisation rather than typed does not stop a thing being program-like, which is the point <a href="https://karpathy.medium.com/software-2-0-a64152b37c35" target="_blank" rel="noopener noreferrer">Karpathy (2017)</a> was reaching for.',
      },
      {
        type: 'paragraph',
        html: 'The objection leaves the deployed level alone, though. When I ask which sorting algorithm a process is running, I do not answer "the CPU". I name what the code encodes. Partial evaluation gives that level a classical form. Specialise an interpreter to one fixed program and the result "behaves exactly the same" as that program, which is the first Futamura projection as Williams and Perugini (2016) present it. <a href="https://doi.org/10.4204/EPTCS.66.8" target="_blank" rel="noopener noreferrer">Cook and Lämmel (2011)</a> work a case close to mine, an interpreter for table-driven state machines, where in the result they aim for "The accept states and the transition table are no longer present as data structures". My solved player does a version of this by hand. It runs the move selector over its value table once for every position before any game, and at move time only the policy is left to read.',
      },
      {
        type: 'paragraph',
        html: 'So the objection forces a distinction between levels, but it does not pick one.',
      },
      { type: 'heading', level: 2, text: 'The test for what belongs' },
      {
        type: 'paragraph',
        html: 'My answer to RQ2 is that computational knowledge can be part of an algorithm, at the deployed level. Run-time state counts as part of a deployed algorithm when three things hold.',
      },
      {
        type: 'list',
        items: [
          'It is persistent.',
          'The executor reads it to decide what to do.',
          'The deployment holds it fixed across the inputs the procedure ranges over, instead of taking it as one of them.',
        ],
        ordered: true,
      },
      {
        type: 'paragraph',
        html: 'That admits weights, a Q table, the policy my solved player reads, a comparator, a parser table and a script fed to an interpreter. For my solved player the value table itself is out, because nothing reads it at move time. A memo table that fills while a program runs is persistent and gets read, but the deployment does not hold it fixed, so it is out too. A system prompt held fixed across a deployment is in, and the words a user types in one conversation are not. The user, the training data and the hardware are not run-time state at all, which is what stops the composite answer spreading out to the power grid.',
      },
      {
        type: 'paragraph',
        html: 'The price is that the test does not care where the state came from. Two systems running bit-identical tables under the same executor have the same status, whether the table was fitted, evolved, copied off a disk or typed by hand. So the category is not one machine learning invented. It is large and old, and neural networks are a recent and extreme member of it. Breiman (2001) made the same move in statistics, calling the fitted predictor "an algorithm that operates on <em>x</em> to predict the responses <em>y</em>".',
      },
      {
        type: 'paragraph',
        html: 'The same test says when two deployed algorithms are one: same executor, same tie rule and same state. I checked this with a second solver that plans against a worst-case opponent. With ties going to the lowest index, the policy read off its table wins 0.994792 against a random opponent. With ties going to the worst of the tied best moves, worst as scored against the random opponent, it wins 0.848958. Not one value in the table changed. A different tie rule over the same table gives a different deployed algorithm.',
      },
      { type: 'heading', level: 2, text: 'Where the behaviour nobody wrote comes from' },
      {
        type: 'paragraph',
        html: 'Nothing in my learner was told to open on the centre, and nothing in the solved player was told to open on a corner. In both, I wrote a general update rule, a way of scoring an outcome and a way of picking among scores, and then a lot of arithmetic ran. <a href="https://doi.org/10.1093/mind/LIX.236.433" target="_blank" rel="noopener noreferrer">Turing (1950)</a> took on this worry as Lady Lovelace\'s objection, that the Analytical Engine "can do <em>whatever we know how to order it</em> to perform". To the variant that a machine can never surprise us, he replied "Machines take me by surprise with great frequency", and he argued that thinking otherwise assumes every consequence of a fact arrives in the mind together with the fact. I could not have predicted the corner opening by reading the Bellman equation, or the centre opening by reading the Q-learning update. Specifying a process is not the same as listing its results, and algorithms have worked that way since long before anyone fitted one to data.',
      },
      { type: 'heading', level: 2, text: 'What this means for teaching' },
      {
        type: 'paragraph',
        html: 'If the split between a procedure and the state it reads is old, the fix belongs inside the algorithms unit that already exists. Denning (2003) wrote that the great principles of computing have been "interred beneath layers of technology in our understanding and our teaching", and he turned down the picture of a pantheon with one pillar per principle. An extra pillar for learned computation would be that picture. I would make three changes.',
      },
      { type: 'heading', level: 3, text: 'Teach the table as the artefact' },
      {
        type: 'paragraph',
        html: 'The way I was taught it, dynamic programming is a recurrence and the assessment is the recurrence. The table is scaffolding, printed once for a small example and then thrown away. But the play comes from the table. A student who has filled a memo table and is then asked what that table is after the run, whether it is data or program, and whether it would still work if the opponent changed, has met the whole question on ground where they can check the answer.',
      },
      { type: 'heading', level: 3, text: 'Teach the level question directly' },
      {
        type: 'paragraph',
        html: 'Ask where the algorithm is for a short list of cases and require the level to be named in the answer. The trained digit classifier is the case worth the time. The same convolution code with a different weight file could sort small photos of clothes, so at the executor level the code is the whole algorithm and the weights are its argument. Anyone who uses it still calls it a digit recogniser. Students should be able to give both answers without finding either evasive, and to spot the slide between them in a paper or an argument.',
      },
      { type: 'heading', level: 3, text: 'Teach correctness of the state as well as of the steps' },
      {
        type: 'paragraph',
        html: 'This is the one I would fight for. A loop invariant proves the steps. It does not tell you whether the table those steps produced is right in the places nobody looked. My learner\'s policy is optimal in 0.9059 of the 2423 positions overall, and in 108 of the 109 positions it meets against a random opponent. The update rule says where errors are likely, in rarely met states and near-ties, but it cannot say which moves are wrong. For that I had to score the learner against a solved reference. The one wrong state it meets in play is the empty board, where the corner beats the centre by 1/192 against a random opponent. That gap is small next to the 0.3423 mean error in its values.',
      },
      {
        type: 'paragraph',
        html: 'So alongside the classical tools, students need generalisation treated as a correctness notion, PAC-style guarantees and what they assume (Valiant, 1984), and the habit of holding out a reference and measuring where the two disagree. This is my version of the point <a href="https://doi.org/10.1145/3488042.3488053" target="_blank" rel="noopener noreferrer">Tedre, Denning and Toivonen (2021)</a> make about correctness.',
      },
      { type: 'heading', level: 2, text: 'A two-hour lab' },
      {
        type: 'paragraph',
        html: 'The three changes fit in one lab, written for students who have met dynamic programming but not reinforcement learning. The teacher hands out the notebook code for both players and the worst-case solver, with its tie rules and seeds, so the good answers are what that code prints. Students work in pairs. By the end of the lab a student should be able to do three things.',
      },
      {
        type: 'list',
        items: [
          '<strong>LO1.</strong> Name the level (executor, deployed or system) whenever they say where the algorithm is in a system, and say what the word picks out at that level.',
          '<strong>LO2.</strong> Apply the three-part test to a piece of run-time state and justify whether it belongs to the deployed algorithm.',
          '<strong>LO3.</strong> Check a learned table against a solved reference, and explain what reasoning about the update rule alone can and cannot tell you about where the two disagree.',
        ],
      },
      {
        type: 'list',
        items: [
          '<strong>Before, 0 to 10 minutes.</strong> Each student writes a definition of "algorithm" in their own words and hands it in.',
          '<strong>Solve, 10 to 30 minutes.</strong> After a short briefing on Markov decision processes and the Q update, students run value iteration and read the policy off the table. A good answer has 9 sweeps, an empty-board value of 191/192 and a corner opening, and notes that all four corners are worth the same.',
          '<strong>Learn, 30 to 55 minutes.</strong> Train the learner on several seeds at 100,000 episodes each and pool the opening cells. A good answer notices that the openings can differ while the update rule never changed. If a class gets the same opening every time, the main run\'s checkpoints still show it moving, with a corner opening at 21 of the 100.',
          '<strong>Swap the tie rule, 55 to 70 minutes.</strong> Read two policies off the worst-case solver\'s table and score both. A good answer has 0.994792 and 0.848958, and says that no value in the table moved.',
          '<strong>Score, 70 to 90 minutes.</strong> Compare the main run\'s greedy moves with the solved player\'s optimal ones in every decision state, then only in the states met against the random opponent. A good answer finds the second rate much higher than the first (mine were 0.9059 and 108 of 109) and says the update rule can point at rarely met states and near-ties but cannot say which moves are wrong.',
          '<strong>Six cases, 90 to 105 minutes.</strong> In groups, fill in the answer key below from its first column only, then find the level slide in a short paragraph the teacher hands out.',
          '<strong>After, 105 to 120 minutes.</strong> Each student writes the definition again, without seeing the first one.',
        ],
        ordered: true,
      },
      {
        type: 'image',
        src: '/writing/sit320-where-is-the-algorithm/answer-key.webp',
        alt: 'Answer key table with four columns: case, executor, state the deployment holds fixed, and input to one run. Sorting: the sort routine, the comparator, the list. Universal machine: its transition procedure, the program on the tape, the data on the tape. Table driven parser: the parser driver, the parse table, the token string. Dynamic programming player: a policy lookup, the policy read once off the value table, the board. Q-learning player: the greedy selector and its tie rule, the Q table, the board. Trained digit classifier: the forward pass, the weight file, the image.',
        caption: 'Table 2 from the paper, the lab\'s answer key. At the executor level the algorithm is the second column on its own. At the deployed level it is the second and third columns together. The fourth column is input at both levels.',
        lightBg: true,
      },
      {
        type: 'paragraph',
        html: 'The paragraph for step 6 can be short. This is the one I wrote to slide on purpose.',
      },
      {
        type: 'blockquote',
        html: 'The network reads its weights on every input and they stay fixed once the model ships, so the weights are part of the algorithm. But the weights are only numbers the inference code reads, so every model trained this way runs the same algorithm.',
      },
      {
        type: 'paragraph',
        html: 'The first sentence works at the deployed level and the second at the executor level, and nothing in the text marks the change. A good answer finds the word changing level between the two sentences and says both can be true once the level is named.',
      },
      {
        type: 'paragraph',
        html: 'LO1 goes after a gap in a workshop study by <a href="https://doi.org/10.1145/3626252.3630950" target="_blank" rel="noopener noreferrer">Bellettini and colleagues (2024)</a>. Over nine workshops they coded definitions of "algorithm" written by 27 groups of students and teachers. Most asked for unambiguous steps, but only three of the 27 mentioned an interpreter or executor, and the authors say getting the interpreter named was often the turning point. <a href="https://doi.org/10.15388/infedu.2021.27" target="_blank" rel="noopener noreferrer">Mirolo, Izu, Lonati and Scapin (2021)</a> report the advice that students "should be made aware of any change of abstraction level", and LO1 is one way to do that.',
      },
      { type: 'heading', level: 2, text: 'How the lab could be evaluated' },
      {
        type: 'paragraph',
        html: 'I have not run this lab and I have not studied any learners. What follows is a plan, and running it would need ethics approval and consent from each student first.',
      },
      {
        type: 'list',
        items: [
          '<strong>Primary measure.</strong> After the lab each student works alone on four new items: a route planner\'s map, a chat deployment where they sort the system prompt from the user\'s messages, a new paragraph that slides between levels, and a handful of learned values set next to the solved ones. The same items come back a week later to separate learning from recall.',
          '<strong>Secondary measure.</strong> Code the before and after definitions with the scheme Bellettini and colleagues used, count how many name an executor, and place each one on Perrenet\'s levels. Perrenet and colleagues report a Cohen\'s kappa of .64 for their level coding, after dropping four items, so I expect that coding to be the hard part.',
          '<strong>Analysis.</strong> Within a class, compare the before and after definitions with McNemar\'s test. Between classes, compare the lab class with a class that does a dynamic programming lab that never asks the level question.',
        ],
      },
      {
        type: 'paragraph',
        html: 'The plan says in advance what would count against the lab. If the lab class does no better than the comparison class on the new items, or loses the gain a week later, the lab did not do its main job. If students name a level on the six cases and then miss the slide in the paragraph, they have learned the level words as labels and are not using them.',
      },
      { type: 'heading', level: 2, text: 'Limits' },
      {
        type: 'list',
        items: [
          'My evidence is one game with 5478 states, two solvers and one learner, all tabular. A Q table is a much friendlier object than a weight vector. I can diff it against an exact answer, which is the only reason I can quote 0.9059 at all. The analogy to large models is about shape, an executor plus persistent control state, and I am not claiming a network is as legible as a Q table.',
          'Provenance changes how you audit a table even when it changes nothing about how the table runs. My value table can be checked against the recurrence that produced it. Nothing that produced my Q table gives me a check like that, so I scored it against a solved reference instead.',
          'For a network the executor is less generic than an interpreter, because the forward pass fixes an architecture. My line is cleanest for tables and blurrier for networks. The next case to build is a digit classifier with one executor and two weight files.',
          'I wrote the definitions, the test and the cases myself, so the cases may fit the test partly because I chose them.',
          'The numbers come from one main run with one pair of seeds. The five other seeds ran a shorter setup with only summaries saved, so I cannot say how much the 200,000-episode player varies from seed to seed.',
          'This is a paper about teaching with no data about learners. I have not run the lab with a class, and I do not know whether the level distinction is teachable in an undergraduate unit or just sounds like hair-splitting to someone who has not yet been surprised by a table.',
        ],
      },
      {
        type: 'paragraph',
        html: 'Two things would change my mind. One is a criterion for membership that turns on how the state was produced and still survives the bit-identical case. The other is a demonstration that every question we ask about a trained model can be answered at the executor level, with the weights treated as input. That would collapse my position into the objection. I do not think it can be done, because naming which program a process is running is not optional, but I have not proved it.',
      },
      { type: 'heading', level: 2, text: 'The answers in one table' },
      {
        type: 'table',
        headers: ['RQ', 'Answer', 'Evidence and test cases'],
        rows: [
          [
            '1',
            'The executor at one level, the executor with its state at the next. The system level gives no answer until it says where it stops.',
            'One update rule, five seeds, three openings. The universal machine objection holds at the executor level only.',
          ],
          [
            '2',
            'State that is persistent, read to decide what to do and held fixed by the deployment. Who wrote it does not matter.',
            'The tie rule moves 0.994792 to 0.848958 with no value changed. The bit-identical case.',
          ],
          [
            '3',
            'Teach the table as the artefact, the level question, and correctness of the state, and test it with the lab.',
            '108 of 109 met states against 0.9059 overall. No learner data yet.',
          ],
        ],
      },
      {
        type: 'paragraph',
        html: 'Two tables, one game, both written by a machine. The classical one has been in the syllabus the whole time, and I was taught around it.',
      },
      { type: 'heading', level: 2, text: 'Papers this builds on' },
      {
        type: 'list',
        items: [
          'Knuth (1997), the five features of an algorithm. Turing (1936), the analysis of what a person following a fixed procedure can compute.',
          'Blass and Gurevich (2003), Gurevich (2012) and Moschovakis (2001), on whether algorithm can be defined.',
          'Wegner (1997) and <a href="https://doi.org/10.1093/comjnl/bxl062" target="_blank" rel="noopener noreferrer">Cockshott and Michaelson (2007)</a>, on interaction and computational power.',
          '<a href="https://doi.org/10.1093/mind/LIX.236.433" target="_blank" rel="noopener noreferrer">Turing (1950)</a>, learning machines and Lady Lovelace\'s objection.',
          '<a href="https://doi.org/10.1145/1067445.1067467" target="_blank" rel="noopener noreferrer">Perrenet, Groote and Kaasenbrood (2005)</a>, levels of abstraction in the concept of algorithm. Marr and Poggio (1976), levels of description. <a href="https://doi.org/10.15388/infedu.2021.27" target="_blank" rel="noopener noreferrer">Mirolo, Izu, Lonati and Scapin (2021)</a>, abstraction in computing education.',
          '<a href="https://doi.org/10.1145/3626252.3630950" target="_blank" rel="noopener noreferrer">Bellettini and colleagues (2024)</a>, the notion of algorithm according to students and teachers. <a href="https://doi.org/10.1145/3571785.3574125" target="_blank" rel="noopener noreferrer">Lonati and colleagues (2022)</a>, what we talk about when we talk about programs.',
          'Sorva (2012) and <a href="https://doi.org/10.1145/3437800.3439202" target="_blank" rel="noopener noreferrer">Fincher et al. (2020)</a>, notional machines. <a href="https://doi.org/10.1145/3488042.3488053" target="_blank" rel="noopener noreferrer">Tedre, Denning and Toivonen (2021)</a>, CT 2.0.',
          '<a href="https://doi.org/10.1007/BF00992698" target="_blank" rel="noopener noreferrer">Watkins and Dayan (1992)</a>, Q-learning. Silver et al. (2017), AlphaGo Zero. Valiant (1984), a theory of the learnable.',
          '<a href="https://karpathy.medium.com/software-2-0-a64152b37c35" target="_blank" rel="noopener noreferrer">Karpathy (2017)</a>, Software 2.0. Breiman (2001), the two cultures. Denning (2003), great principles of computing.',
          'Williams and Perugini (2016), the Futamura projections. <a href="https://doi.org/10.4204/EPTCS.66.8" target="_blank" rel="noopener noreferrer">Cook and Lämmel (2011)</a>, online partial evaluation.',
        ],
      },
      {
        type: 'paragraph',
        html: '<a href="/writing/sit320-where-is-the-algorithm/paper.pdf" target="_blank" rel="noopener noreferrer">Read the full paper (PDF)</a>. It has the method and its five conditions, the full lab and evaluation plan, and every reference.',
      },
    ],
  },
]

export const ALL_TAGS: string[] = Array.from(
  new Set(POSTS.flatMap(p => p.tags))
).sort()
