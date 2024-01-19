import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Stack,
} from "@mui/material";
import { useState } from "react";

import { TBid } from "@gqlOps/jobBid";
import { IJob } from "@gqlOps/job";
import Text from "@reusable/Text";
import BidViewDrawer from "./miniBids/BidViewDrawer";
import { IUser } from "@/graphql/operations/user";

type Props = { job: IJob; bid: TBid; jobPoster: IUser | undefined };
export default function AcceptedBid({ bid, job, jobPoster }: Props) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const bidder = bid?.contractor?.user;
  const avatarSize = 60;

  return (
    <Stack>
      <Text cColor="dark" sx={{ mx: 2, my: 1, fontWeight: 550 }}>
        Hired Bidder
      </Text>
      <Divider />
      <List component="nav">
        <ListItem disableGutters>
          <ListItemButton
            onClick={() => setOpenDrawer(true)}
            sx={{ justifyContent: "space-between" }}
          >
            <Stack direction={"row"} alignItems={"center"}>
              <Avatar
                alt={bidder?.name}
                src={bidder?.image?.url}
                sx={{ width: avatarSize, height: avatarSize, mr: 1 }}
              />
              <Text type="subtitle" sx={{ mr: 1 }}>
                {bidder?.name}
              </Text>
            </Stack>
            <Stack>
              <Text sx={{ fontWeight: 450 }}>Quote:</Text>
              <Text cColor="primary" sx={{ fontWeight: 550 }}>
                ${bid.quote}
              </Text>
            </Stack>
          </ListItemButton>
        </ListItem>
      </List>

      <BidViewDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        bid={bid}
        job={job}
        disableBidAction
        jobPoster={jobPoster}
      />
    </Stack>
  );
}
