import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalculateIcon from "@mui/icons-material/Calculate";

interface HeaderProps {
  onNavigateToList: () => void;
  onNavigateToForm: () => void;
  onNavigateToSimulator: () => void;
}

function Header({ onNavigateToList, onNavigateToForm, onNavigateToSimulator }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="static" style={{background:"var(--color-bg-primary)"}} enableColorOnDark>
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        <LocalOfferIcon sx={{ mr: { xs: 0.5, sm: 1 } }} />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: { xs: '0.9rem', sm: '1.25rem' },
            ml: { xs: 0.5, sm: 0 }
          }}
        >
          {isMobile ? "Descuentos" : "Sistema de Descuentos"}
        </Typography>

        <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
          {isMobile ? (
            // Mobile: IconButtons only
            <>
              <IconButton color="inherit" onClick={onNavigateToList} size="small">
                <ListAltIcon />
              </IconButton>
              <IconButton color="inherit" onClick={onNavigateToForm} size="small">
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton color="inherit" onClick={onNavigateToSimulator} size="small">
                <CalculateIcon />
              </IconButton>
            </>
          ) : (
            // Desktop/Tablet: Buttons with text
            <>
              <Button 
                color="inherit" 
                startIcon={<ListAltIcon />} 
                onClick={onNavigateToList}
                size={isTablet ? "small" : "medium"}
              >
                List
              </Button>
              <Button 
                color="inherit" 
                startIcon={<AddCircleOutlineIcon />} 
                onClick={onNavigateToForm}
                size={isTablet ? "small" : "medium"}
              >
                Create
              </Button>
              <Button 
                color="inherit" 
                startIcon={<CalculateIcon />} 
                onClick={onNavigateToSimulator}
                size={isTablet ? "small" : "medium"}
              >
                Simulator
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
