import { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import dbConnect from "../../../../../server/mongodb";
import Organization from "../../../../../server/mongodb/models/Organization";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const organizationId = req.query.id as string;
  const organization = await Organization.findById(organizationId);
  if (!organization) {
    return res.status(404).json({
      error: `Organization with id ${organizationId} not found`,
    });
  }

  switch (req.method) {
    case "GET": {
      return res
        .status(200)
        .json({ invitedAdmins: organization.invitedAdmins });
    }
    case "POST": {
      const { data: email } = req.body as { data: string };
      const result = z.string().email().safeParse(email);

      if (result.success) {
        await organization.updateOne({
          $push: { invitedAdmins: email },
        });
        return res
          .status(200)
          .json({ invitedAdmins: organization.invitedAdmins });
      }
      return res.status(400).json({ error: "Invalid email" });
    }
    case "DELETE": {
      const email = req.body as string;

      if (z.string().email().safeParse(email).success) {
        await organization.updateOne({ $pull: { invitedAdmins: email } });
        return res
          .status(200)
          .json({ invitedAdmins: organization.invitedAdmins });
      }
      return res.status(400).json({ error: "Invalid email" });
    }
  }
};
