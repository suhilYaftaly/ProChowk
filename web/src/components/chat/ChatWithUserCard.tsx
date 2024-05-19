import {
  Avatar,
  Card,
  CardActionArea,
  Rating,
  Stack,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import { Sms } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { IUser } from "@gqlOps/user";
import Text from "../reusable/Text";
import { useMutation } from "@apollo/client";
import { CreateConversationData } from "@/types/types";
import { conversationOps } from "@/graphql/operations/conversation";
import { IConversationResponse } from "../../../../backend/src/types/commonTypes";
import { client } from "@/graphql/apollo-client";
import { paths } from "@/routes/Routes";

type Props = { user: IUser; onClick?: () => void };
export default function ChatWithUserCard({ user, onClick }: Props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const userCardBGC = alpha(theme.palette.secondary.light, 0.2);
  const primaryC = theme.palette.primary.main;
  const iconColor = theme.palette.secondary.dark;

  const [createConversation, { data }] = useMutation<
    CreateConversationData,
    { participantId: string }
  >(conversationOps.Mutations.createConversation);

  const onPosterClick = async () => {
    console.log(user);
    if (user) {
      const conversationId = findExistingConversation();
      console.log(conversationId);
      if (conversationId) {
        navigate(paths.conversationView(conversationId));
        return;
      }

      await createNewConversation();
    }
    onClick && onClick();
  };

  const findExistingConversation = (): string | null => {
    const data = client.readQuery<IConversationResponse[]>({
      query: conversationOps.Queries.userConversations,
    });

    if (data) {
      for (const conversation of data.conversations.conversations) {
        const participantChat = conversation.participants.filter(
          (p) => p.user.id === user.id
        );

        if (
          participantChat != null &&
          participantChat != undefined &&
          participantChat.length > 0
        ) {
          return conversation.id;
        }
      }
    }

    return null;
  };

  const createNewConversation = async () => {
    try {
      const { data, errors } = await createConversation({
        variables: {
          participantId: user.id,
        },
      });
      if (!data?.createConversation || errors) {
        throw new Error("Failed to create conversation");
      }
      console.log(data);
      navigate(paths.conversationView(data.createConversation));
      return;
    } catch (error: any) {
      console.log("createConversations error", error);
    }
  };

  return (
    <Tooltip title={`Chat with ${user.name}`}>
      <Card variant="outlined" sx={{ backgroundColor: userCardBGC }}>
        <CardActionArea sx={{ p: 2 }} onClick={onPosterClick}>
          <Stack
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Stack direction={"row"}>
              <Avatar
                alt={user?.name}
                src={user?.image?.url}
                sx={{ width: 50, height: 50, mr: 1 }}
              />
              <Stack>
                <Text type="subtitle">{user?.name}</Text>
                <Rating
                  defaultValue={4.4}
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{ color: primaryC }}
                />
              </Stack>
            </Stack>
            <Sms sx={{ width: 30, height: 30, color: iconColor }} />
          </Stack>
        </CardActionArea>
      </Card>
    </Tooltip>
  );
}
