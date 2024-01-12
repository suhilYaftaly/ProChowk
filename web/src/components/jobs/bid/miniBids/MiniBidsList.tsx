import { Stack, Card, CardActionArea, Avatar } from "@mui/material";
import { useState } from "react";

import Text from "@reusable/Text";
import { TBid } from "@gqlOps/jobBid";
import BidViewDrawer from "./BidViewDrawer";
import { IJob } from "@gqlOps/job";

type Props = { job: IJob; bids: TBid[] };
export default function MiniBidsList({ bids, job }: Props) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeBidIndex, setActiveBidIndex] = useState(0);
  const avatarSize = 30;

  const onClick = (bidId: string) => {
    const bidIndex = bids.findIndex((bid) => bid.id === bidId);
    setActiveBidIndex(bidIndex);
    setOpenDrawer(true);
  };

  return (
    <Stack>
      <Text type="subtitle" sx={{ mb: 2 }}>
        Bids{" "}
        <Text type="subtitle" component={"span"} cColor="primary">
          ({bids.length || "0"})
        </Text>
      </Text>
      <Stack spacing={1}>
        {bids.map((bid) => {
          const user = bid?.contractor?.user;
          return (
            <Card variant="outlined" key={bid.id}>
              <CardActionArea
                sx={{ py: 1, px: 1.5 }}
                onClick={() => onClick(bid.id)}
              >
                <Stack
                  direction={"row"}
                  sx={{ alignItems: "center", justifyContent: "space-between" }}
                >
                  <Stack direction={"row"} alignItems={"center"}>
                    <Avatar
                      alt={user?.name}
                      src={user?.image?.url}
                      sx={{ width: avatarSize, height: avatarSize, mr: 1 }}
                    />
                    <Text cColor="dark" sx={{ mr: 1, fontWeight: 450 }}>
                      {user?.name}
                    </Text>
                  </Stack>
                  <Stack>
                    <Text sx={{ fontWeight: 450 }}>Quote:</Text>
                    <Text cColor="primary" sx={{ fontWeight: 550 }}>
                      ${bid.quote}
                    </Text>
                  </Stack>
                </Stack>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>
      <BidViewDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        bid={bids?.[activeBidIndex]}
        job={job}
      />
    </Stack>
  );
}
