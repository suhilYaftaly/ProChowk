import {
  Divider,
  Paper,
  Stack,
  SwipeableDrawer,
  useTheme,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { useState } from "react";

import Text from "@reusable/Text";
import { TBid } from "@gqlOps/jobBid";
import { readISODate } from "@/utils/utilFuncs";
import { IJob } from "@gqlOps/job";
import BidActionControl from "./BidActionControl";
import { useUserStates } from "@/redux/reduxStates";
import { agreementTxt } from "@/config/data";
import BidRejectForm from "./BidRejectForm";
import ChatWithUserCard from "@chat/ChatWithUserCard";

type Props = {
  bid: TBid;
  job: IJob;
  openDrawer: boolean;
  setOpenDrawer: (toggle: boolean) => void;
  /**disable accept/reject buttons @default false */
  disableBidAction?: boolean;
};
export default function BidViewDrawer({
  bid,
  job,
  openDrawer,
  setOpenDrawer,
  disableBidAction = false,
}: Props) {
  const { userId } = useUserStates();
  const theme = useTheme();
  const lightC = theme.palette.text.light;
  const p = 2;
  const ownderId = job?.userId;
  const isMyPostedJob = ownderId === userId;
  const [isBidRejected, setIsBidRejected] = useState(false);
  const poster = bid?.contractor?.user;
  const isMyBid = poster?.id === userId;

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  return (
    <SwipeableDrawer
      anchor="right"
      open={openDrawer}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
    >
      <Stack sx={{ justifyContent: "space-between", flex: 1, width: 320 }}>
        <Stack>
          <Stack sx={{ p }}>
            <Text type="subtitle">{job?.title}</Text>
            <Stack direction={"row"} sx={{ alignItems: "center", mt: 0.5 }}>
              {job?.address?.city && (
                <>
                  <LocationOn
                    sx={{ color: lightC, width: 20, height: 20, mr: 0.5 }}
                  />
                  <Text sx={{ color: lightC }}>
                    {job?.address?.city}, {job?.address?.stateCode}
                  </Text>
                </>
              )}
            </Stack>
          </Stack>
          <Divider />
          <Stack sx={{ p }}>
            {isBidRejected ? (
              <BidRejectForm
                bidId={bid.id}
                onSuccess={toggleDrawer}
                onGoBack={toggleDrawer}
              />
            ) : (
              <>
                <Text sx={{ fontWeight: 500, mb: 1 }}>
                  Bid Quote: <Text component={"span"}>${bid?.quote}</Text>
                </Text>
                {bid?.startDate && (
                  <Text sx={{ fontWeight: 500 }}>
                    Start Date:{" "}
                    <Text component={"span"}>
                      {readISODate(bid?.startDate)}
                    </Text>
                  </Text>
                )}
                {bid?.endDate && (
                  <Text sx={{ fontWeight: 500, mt: 1 }}>
                    End Date:{" "}
                    <Text component={"span"}>{readISODate(bid?.endDate)}</Text>
                  </Text>
                )}
                {bid?.proposal && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Text sx={{ fontWeight: 500, mb: 0.5 }}>Proposal</Text>
                    <Text>{bid?.proposal}</Text>
                  </>
                )}
                <Divider sx={{ my: 2 }} />
                <Text sx={{ fontWeight: 500, mb: 0.5 }}>Agreements</Text>
                <Text sx={{ mb: 3 }}>{agreementTxt}</Text>
                <Divider sx={{ my: 2 }} />
                {!isMyBid && poster && (
                  <>
                    <Text type="subtitle" sx={{ mb: 1 }}>
                      Chat with the contractor!
                    </Text>
                    <ChatWithUserCard user={poster} />
                  </>
                )}
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
      {!disableBidAction && isMyPostedJob && !isBidRejected && (
        <Paper sx={{ position: "sticky", bottom: 0 }}>
          <Divider />
          <BidActionControl
            bidId={bid.id}
            onReject={() => setIsBidRejected(true)}
            onAcceptSuccess={toggleDrawer}
          />
        </Paper>
      )}
    </SwipeableDrawer>
  );
}
