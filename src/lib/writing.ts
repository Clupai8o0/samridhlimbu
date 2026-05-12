export type ContentBlock =
  | { type: 'paragraph'; html: string; dropCap?: boolean }
  | { type: 'blockquote'; html: string }
  | { type: 'heading'; text: string; level: 2 | 3 }
  | { type: 'code'; lang?: string; code: string; label?: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'video'; href: string; label: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'equation'; html: string; caption?: string }

export type Post = {
  slug: string
  title: string
  date: string
  readMin: number
  tags: string[]
  excerpt: string
  featured?: boolean
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

export const POSTS: Post[] = [
  {
    slug: 'cryptography-and-blockchain',
    title: 'Cryptography and blockchain — from hash functions to 51% attacks',
    date: '2026-05-12',
    readMin: 22,
    tags: ['cryptography', 'blockchain', 'sha-256', 'math'],
    excerpt:
      'My SIT202 5.1HD writeup. Cryptography from first principles, SHA-256 walked through gate by gate, Merkle trees, ECDSA, proof of work, and the mathematics behind why a 51% attack is technically possible and economically absurd.',
    featured: true,
    content: [
      {
        type: 'paragraph',
        dropCap: true,
        html:
          'I wrote this as the high-distinction task for SIT202 — Deakin\'s networks-and-security unit — and the brief was simple in shape and brutal in scope: explain blockchain end-to-end, but mean it. Not "blocks are linked by hashes" hand-waving. Show the modular arithmetic. Walk SHA-256. Justify why ECDSA works. Put numbers on the 51% attack. What follows is that paper, restructured as a long-form blog post.',
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
      'My SIT202 3.2H writeup — a threaded TCP chat with mutual TLS, self-signed certs minted in Python, the handshake walked through end to end, and an honest list of the security properties this thing does and does not give you.',
    featured: true,
    content: [
      {
        type: 'paragraph',
        dropCap: true,
        html:
          'This started as an assignment for SIT202 — Deakin\'s networks-and-security unit — and ended up being the project where TLS finally stopped feeling like a magic incantation. The brief asked for a chat application in Python with encrypted communication. I could have wrapped <code>socket.socket</code> in <code>ssl.wrap_socket</code> and called it done. Instead I built it from the cert generator up, watched the handshake in Wireshark, and wrote down which flags I was setting and which defaults I was trusting. What follows is the same writeup, restructured for a blog: walkthrough first, code second, threat model third.',
      },
      { type: 'heading', level: 2, text: 'What I was trying to learn' },
      {
        type: 'paragraph',
        html:
          'The unit-level learning objectives were the usual mix: how TLS secures client-server traffic, how to set up SSL certificates in Python, how to implement and test a TLS-secured chat with <code>socket</code> and <code>ssl</code>, how to analyse encrypted traffic in Wireshark, and how to be honest about the limits of a base TLS implementation. The personal goal underneath that was simpler — to be able to defend every line of code I wrote.',
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
      },
      {
        type: 'image',
        src: '/writing/secure-tls-chat/tls-handshake-part2.png',
        alt: 'TLS key exchange and data transmission flow diagram',
        caption: 'Part 2 — key exchange, change cipher spec, and the symmetric data phase.',
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
          'The full source — <code>generate_certs.py</code>, <code>server.py</code>, <code>client.py</code> — lives on <a href="https://github.com/Clupai8o0/sit202-3.2h" target="_blank" rel="noopener noreferrer">GitHub</a>. The walkthrough below is the same shape as the original report: certs, then server, then client, then a run.',
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
          'In production, certificates are issued by a Certificate Authority — Let\'s Encrypt, an internal PKI, anyone whose root is already in your trust store. For a coursework project that lives entirely on <code>localhost</code>, I generate them myself. Both endpoints are the issuer; both endpoints manually trust the other\'s cert. The trust boundary is my laptop, and that\'s acceptable for what this is.',
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
          '<code>client.py</code> is the mirror image of the server: TCP socket, SSL context, wrap, connect, then two threads — one reads stdin and sends, one reads the socket and prints. There\'s one line I want to call out because it would be a real bug anywhere outside coursework.',
      },
      { type: 'heading', level: 3, text: 'Setup and wrap' },
      { type: 'code', lang: 'python', code: CLIENT_SETUP },
      {
        type: 'paragraph',
        html:
          '<code>check_hostname = False</code> is the dangerous line. Hostname verification is what ties a certificate to the name you dialled — it stops "any cert in my trust store" from becoming "any host can present any of those certs and I\'ll believe them." I disabled it because the self-signed setup\'s CN matching gets fussy and the assignment isn\'t about debugging PKI. In production with a real CA, that line is deleted.',
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
          'What this exercise gave me, beyond a pass on the unit, was a less mystical relationship with TLS. It\'s a state machine on top of a socket. The defaults are good. The places where you override them are exactly the places where you\'re taking responsibility for what "secure" means in your specific setup. The certificate is a file; the trust is a decision; the encryption is just math you chose to plug in.',
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
]

export const ALL_TAGS: string[] = Array.from(
  new Set(POSTS.flatMap(p => p.tags))
).sort()
