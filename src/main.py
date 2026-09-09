from math import atan2, hypot, degrees
from json import loads, dumps

from smdb_logger import Logger, LEVEL
from smdb_web_server import HTMLServer, UrlData, Protocol

class Calculator:
    logger: Logger = Logger(enable_color=False, use_caller_name=True, use_file_names=True, level=LEVEL.INFO, max_caller_chain_size=5)
    server: HTMLServer = HTMLServer(
        host="0.0.0.0",
        port=8080,
        logger=Logger(enable_color=False, max_caller_chain_size=5, level=LEVEL.WARNING),
        title="Artillery Calculator",
    )
    scale: int
    origin_x: int
    origin_y: int

    def init(self):
        self.server.add_url_rule(rule="/", callback=self.index)
        self.server.add_url_rule(rule="/calculate", callback=calculator.calculate, protocol=Protocol.Post)
        self.server.add_url_rule(rule="/origin", callback=self.set_origin, protocol=Protocol.Post)
        self.server.add_url_rule(rule="/scale", callback=self.set_scale, protocol=Protocol.Post)

    def start(self) -> None:
        self.init()
        self.logger.info(f"Serving at http://{self.server.host}:{self.server.port}/")
        self.server.serve_forever(
            templates={},
            static={"index":"PATH|static/index.html", "style":"PATH|static/style.css", "script":"PATH|static/script.js"},
        )

    def index(self, data: UrlData) -> str:
        self.logger.debug(f"{data}")
        return self.server.render_static_file("index.html")

    def calculate(self, data: UrlData) -> str:
        self.logger.debug(f"{data}")
        data = loads(data.data.decode("utf-8"))
        target_x = data["x"]
        target_y = data["y"]
        self.logger.debug(f"Calculating {target_x}, {target_y}")
        dist_x = int(target_x * self.scale) - self.origin_x
        dist_y = int(target_y * self.scale) - self.origin_y
        _range = hypot(dist_x, dist_y)
        self.logger.trace(f"Range: {_range:.2f}m")
        bearing_r = atan2(dist_x, dist_y)
        bearing = (degrees(bearing_r) + 360) % 360
        self.logger.trace(f"Bearing: {bearing:.2f}m")
        return dumps({"bearing": bearing, "distance": _range})

    def set_origin(self, data: UrlData) -> str:
        self.logger.debug(f"{data}")
        data = loads(data.data.decode("utf-8"))
        self.origin_x = int(data["x"] * self.scale)
        self.origin_y = int(data["y"] * self.scale)
        self.logger.trace(f"Origin: {self.origin_x}, {self.origin_y}")
        return ""

    def set_scale(self, data: UrlData) -> str:
        self.logger.debug(f"{data}")
        data = loads(data.data.decode("utf-8"))
        self.scale = data["scale"]
        return ""

if __name__ == "__main__":
    calculator = Calculator()
    calculator.start()
