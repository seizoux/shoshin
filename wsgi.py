from server import app

if __name__ == "__main__":
    app.run(unix_socket="shoshin.sock")