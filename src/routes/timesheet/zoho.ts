import jwt from "jsonwebtoken";
import fetch from "node-fetch";

const SendToZohoSignFlow = async (req: any, res: any) => {
  // get the sub from the jwt token to be used as the userId
  const sub = jwt.decode(req.headers.authorization).sub;

  const body = req.body;
  console.log(body);

  // Make sure a real user is calling this
  if (sub && body) {
    const url =
      "https://flow.zoho.com/695890080/flow/webhook/incoming?zapikey=1001.e8e7db119182be1d569c6958caa0140f.cb23cac801224d128ba502c4d08f1c80&isdebug=false";
    const method = "POST";

    const headers = {
      "Content-Type": "application/json",
    };

    await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    res.status(200).send("Success");
  } else {
    res.status(401).send("Unauthorized");
  }
};

export { SendToZohoSignFlow };
