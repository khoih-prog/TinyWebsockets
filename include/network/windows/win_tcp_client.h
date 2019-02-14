#pragma once

#include "common.h"
#include "network/tcp_client.h"
#include "network/windows/win_tcp_socket.h"

namespace websockets::network {
	class WinTcpClient : public TcpClient {
	public:
		bool connect(WSString host, int port) {
			return socket.connect(host, port);
		}

		bool poll() {
			return socket.poll();
		}

		bool available() override {
			return socket.available();
		}

		void send(WSString data) override {
			socket.send(data);
		}

		void send(uint8_t* data, uint32_t len) override {
			socket.send(data, len);
		}
		
		WSString readLine() override {
			return socket.readLine();
		}

		void read(uint8_t* buffer, uint32_t len) override {
			socket.read(buffer, len);
		}

		void close() override {
			socket.close();
		}

		virtual ~WinTcpClient() {}
	private:
		WinTcpSocket socket;
	};
}