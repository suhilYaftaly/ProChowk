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

type Props = { job: IJob; bid: TBid };
export default function AcceptedBid({ bid, job }: Props) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const user = bid?.contractor?.user;
  const avatarSize = 60;

  return (
    <Stack>
      <Text cColor="dark" sx={{ mx: 2, my: 1, fontWeight: 550 }}>
        Accepted Bid
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
                alt={user?.name}
                src={user?.image?.url}
                sx={{ width: avatarSize, height: avatarSize, mr: 1 }}
              />
              <Text type="subtitle" sx={{ mr: 1 }}>
                {user?.name}
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
      />
    </Stack>
  );
}
