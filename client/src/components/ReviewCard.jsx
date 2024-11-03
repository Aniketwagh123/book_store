import { Avatar, Box, Grid, Rating, Typography } from "@mui/material";

const ReviewCard = () => {
  return (
    <Grid container spacing={2} style={{ marginTop: "20px" }}>
      <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
        <Avatar>AC</Avatar>
        <Box ml={2}>
          <Typography variant="subtitle2">Aniket Wagh</Typography>
          <Rating value={3.5} readOnly />
          <Typography variant="body2" style={{ marginTop: "5px" }}>
            Good product. Even though the translation could have been better,
            Chanakya neeti are thought-provoking. Chanakya has written on many
            different topics and his writings are succinct.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ReviewCard;
