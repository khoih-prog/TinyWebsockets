[![Build Status](https://travis-ci.org/gilmaimon/TinyWebsockets.svg?branch=master)](https://travis-ci.org/gilmaimon/TinyWebsockets)

# Tiny Websockets

A minimal websockets implementation in C++. Aimed to provide a simple and slim interface for basic Websockets work. Currently contains a `WebsocketsClient` and a `WebsocketsServer`.

Key Features:

* Supports [RFC-6455](https://tools.ietf.org/html/rfc6455) features: **Pings**, **Pongs**, **Data Messages** ect.
* A Modern **Callbacks-Based interface** and a **Blocking (sync) interface**.
* **Cross Platform**, support: **Windows**, **Linux**, and **Arduino** (ESP8266 and ESP32, see [ArduinoWebsockets](https://github.com/gilmaimon/ArduinoWebsockets))
* Websockets **Client** and **Server** APIs.
* Fully supports **Fragmented Messages** and streaming
* Supports Client-Side Websokcets over **SSL/TLS**

## Table Of Contents

* [What are Websockets](#what-are-websockets)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Examples](#examples)
* [Contributing](#contributing)
* [License](#license)

## What are Websockets?

The Websockets Protocol is a way for clients and servers to exchange `Messages` over TCP in a known, common way. It is essentially a thin standard above raw TCP communication.

A typical Websockets communication consists of 2 `Endpoints`: a `Client` and a `Server`. Before Endpoints can communicate they must perform an `handshake` and negotiate over the protocol's `Version`, the usage of `Sub-Protocols` and more. The `handshake` is an important step in the communication, but will not be covered here as it is very low-level. You can read more about the proccess [here](https://tools.ietf.org/html/rfc6455#page-6).

<p align="center">
<img src="https://cdn-images-1.medium.com/max/1200/1*0w3tMXm7jr174bqOprcdOg.png" width="450px" />

<sup>*Credit: taken from an [article by Thilina Ashen Gamage](https://medium.com/platform-engineer/web-api-design-35df8167460)* </sup>
</p>
</br>

More details about the protocol can be found in the Wiki Page: [What are Websockets?](https://github.com/gilmaimon/TinyWebsockets/wiki/What-are-Websockets%3F).

## Getting Started

### Installation

In order to get started and building the first TinyWebsockets demo on your machine, you should:

1. Clone the repo

```sh
git clone https://github.com/gilmaimon/TinyWebsockets.git
```

2. Run cmake

```sh
mkdir build
cd build
cmake ..
make demo_echo_client
```

3. Run the demo:

```sh
./demo_echo_client
```

### Linking to Your Own Project

#### CMake

Using **cmake**, first you need to incldue the library folder (named `tiny_websockets_lib`) as a subdirectory in your own project's `CMakeLists.txt`.

For example, if you place the directory under in `libs/tiny_websockets_lib` add to your `CMakeLists.txt`:

```cmake
add_subdirectory(libs/tiny_websockets_lib)
```

Then, add the library to the executable by adding:

```cmake
target_link_libraries (my_executable tiny_websockets_lib)
```

## Usage
I recommend reading the examples below to get the basic usage of the library. For further reference, try the [Wiki Docs](https://github.com/gilmaimon/TinyWebsockets/wiki).

## Examples

This section shows some basic examples for server and client code using the library. More demos can be found in the root library directory (`.cpp` files with the prefix `demo_`).

### Client

Example of basic `WebsocketsClient` usage:

```c++
#include <tiny_websockets/client.hpp>
#include <iostream>

using namespace websockets;

int main() {
  // connect to host
  WebsocketsClient client;
  client.connect("http://localhost:8080");
  
  // handle messages
  client.onMessage([](WebsocketsMessage message) {
    std::cout << "Got: " << message.data() << std::endl;
  });
  
  // handle events
  client.onEvent([](WebsocketsEvent event, std::string data) {
    // Handle "Pings", "Pongs" and other events 
  });
  
  // send a message
  client.send("Hi Server!");
  
  while(client.available()) {
    // wait for server messages and events
    client.poll();
  }
}
```

### Server

Example of basic `WebsocketsServer` usage:

```c++
#include <tiny_websockets/server.hpp>
#include <iostream>

using namespace websockets;

int main() {
  WebsocketsServer server;
  server.listen(8080);
  
  // while possible
  while(server.available()) {
    // accept another client
    WebsocketsClient client = server.accept();

    // wait for a message for the client and send an echo response
    auto message = client.readBlocking();
    client.send("Echo: " + message.data());

    // close the connection
    client.close();
  }
}

```

## Contributing

There are many issues and missing features that can use a hand so Pull requests are welcomed.

For major changes, please open an issue first to discuss what you would like to change.

### How to Contribute

The best and easiest way to help is to clone the library, test it for yourself and share any difficulties you have. You can share your opinion and experience on the interface, complexity or any issues and suggestions you have for the library.

### Project Structure

The projects file structure is as follows:

```python
.
├── tiny_websockets_lib/ # root library folder
|   ├── include/tiny_websockets/
|   |   ├── internals/ # rules and base classes
|   |   |  ├── wscrypto/ # crypto helpers (base64, sha1)
|   |   |  ├── ...
|   |   |  └── websockets_endpoint.hpp # WebsocketsEndpoint
|   |   ├── network/ # internal TCP clients
|   |   ├── ...
|   |   ├── message.hpp # WebsocketsMessage
|   |   ├── client.hpp # WebsocketsClient
|   |   └── server.hpp # WebsocketsServer
|   ├── src/ # impl (.cpp) files
|   └── CMakeLists.txt
|
├── tests
|   ├── catch2/ # catch2 for writing tests
|   ├── ext/ # helpers (such as a node ws server) for testing
|   └── src/
|       ├── some_feature_test.cpp # test file with main()
|       ├── ... # test file with main()
|       └── other_feature_test.cpp # test file with main()
|
├── CMakeLists.txt
├── demo_echo_client.cpp # demo program
├── ... # more demo programs
└── ... # more demo programs
```

### Running the Tests
After making a change you would want to make sure the tests run properly and add your own tests.

In order to run the tests, execute this from the root directory:

```bash
mkdir build
cd build
cmake ..
make # see if build is successfull after changes
make test # check for CTest output after changes
```

### Missing Features

* Support for SSL/WSS - currently the library has only support client side and does not support creating ssl servers.

## License

This project is Open Source and is licensed under the [GNU General Public License v3.0](LICENSE).
