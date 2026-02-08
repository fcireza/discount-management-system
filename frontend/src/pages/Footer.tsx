import { Box, Container, Divider, Link, Typography } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

function Footer() {
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5107";
  const backendUrl = apiBaseUrl.replace(/\/api$/, "");
  const swaggerUrl = `${backendUrl}/swagger/index.html`;

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: "divider",
        py: { xs: 2, sm: 3 },
        mt: "auto",
        textAlign: "center",
        bgcolor: "grey.100",
      }}
    >
      <Container>
        <Link
          href={swaggerUrl}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 0.5, 
            mb: 1.5,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          <MenuBookIcon fontSize="small" />
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            API Documentation (Swagger)
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            API Docs
          </Box>
        </Link>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          Discount Management System
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          © {currentYear} - Developed by fcireza. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
