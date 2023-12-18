import { Collapse, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface Props {
  text: string | undefined;
  maxHeight?: number;
}

export default function ShowMoreTxt({ text, maxHeight = 70 }: Props) {
  const textRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
  const [shouldTruncate, setShouldTruncate] = useState(false);
  const [contentHeight, setContentHeight] = useState(maxHeight);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      const { scrollHeight } = element;
      setShouldTruncate(scrollHeight > maxHeight);
      setContentHeight(scrollHeight);
    }
  }, [text, maxHeight]);

  if (!text) return null;

  const adjustedCollapsedSize = shouldTruncate ? maxHeight : contentHeight;

  return (
    <>
      <Collapse
        in={showMore}
        collapsedSize={adjustedCollapsedSize}
        timeout={500}
      >
        <Typography
          ref={textRef}
          sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
        >
          {text}
        </Typography>
      </Collapse>
      {shouldTruncate && (
        <Button
          sx={{ mt: 1, alignSelf: "center" }}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show less..." : "Show more..."}
        </Button>
      )}
    </>
  );
}
