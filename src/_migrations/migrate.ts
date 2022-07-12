import V1 from "./v1";

const Upgrade = async (e, a) => {
  await V1().up();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Migration successful",
    }),
  };
};

const Downgrade = async (e, a) => {
  await V1().down();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Migration successful",
    }),
  };
};

const Migrate = {
  up: Upgrade,
  down: Downgrade,
};

export default Migrate;
