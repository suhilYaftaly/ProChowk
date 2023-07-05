import { Collapse, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface Props {
  text: string | undefined;
  maxHeight?: number;
}

export default function ShowMoreTxt({ text, maxHeight = 60 }: Props) {
  const textRef = useRef(null);
  const [showMore, setShowMore] = useState(false);
  const [shouldTruncate, setShouldTruncate] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      const { scrollHeight } = element;
      setShouldTruncate(scrollHeight > maxHeight);
    }
  }, [text, maxHeight]);

  return (
    <>
      <Collapse in={showMore} collapsedSize={maxHeight}>
        <Typography
          ref={textRef}
          variant="body2"
          sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
        >
          {text}
        </Typography>
      </Collapse>
      {shouldTruncate && (
        <Button size="small" onClick={() => setShowMore(!showMore)}>
          {showMore ? "Show less..." : "Show more..."}
        </Button>
      )}
    </>
  );
}
