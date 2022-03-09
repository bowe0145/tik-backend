import jwt from "jsonwebtoken";
import { CognitoIdentityServiceProvider } from "aws-sdk";

const FetchAllUsers = async function (req, res) {
  // Get the cognito:groups from the token
  const groups = jwt.decode(req.headers.authorization)?.["cognito:groups"];

  // If the user is an admin, return all users
  if (groups?.includes("admin")) {
    // Check if there's a PaginationToken in the querystring
    let { PaginationToken, Limit } = req.query;
    // If there's a PaginationToken, make sure it's valid
    console.log(`PaginationToken before encoding`, PaginationToken);
    if (PaginationToken) {
      PaginationToken = PaginationToken.replace(" ", "+");
    }
    console.log(`PaginationToken: `, PaginationToken);

    const params = {
      UserPoolId: process.env.COGNITO_POOL_ID,
      AttributesToGet: ["email", "sub"],
      Limit: Limit?.toString() || 1,
      PaginationToken,
    };

    try {
      const cognitoidentityserviceprovider =
        new CognitoIdentityServiceProvider();
      // Calling the listUsers operation
      const data = await cognitoidentityserviceprovider
        .listUsers(params)
        .promise();

      // Return the users
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  } else {
    // If the user is not an admin, return an error
    res.status(403).json({
      error: "You must be an admin to view this endpoint.",
    });
  }
};

export { FetchAllUsers };
