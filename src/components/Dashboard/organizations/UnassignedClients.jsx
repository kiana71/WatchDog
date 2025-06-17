import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Select, MenuItem, FormControl, Popper, Paper } from '@mui/material';
import { Circle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const UnassignedClients = ({ clients = [], organizations = [], onAssignClient }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isSubmenuHovered, setIsSubmenuHovered] = useState(false);

  const handleOrgHover = (event, org) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrg(org);
  };

  const handleClose = () => {
    if (!isSubmenuHovered) {
      setAnchorEl(null);
      setSelectedOrg(null);
    }
  };

  if (!clients || clients.length === 0) {
    return (
      <Box p={2}>
        <Typography color="textSecondary">No unassigned clients</Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        bgcolor: isDarkMode ? '#1f2937' : 'white',
        borderRadius: 1,
        boxShadow: 1,
        border: isDarkMode ? 'none' : '1px solid',
        borderColor: isDarkMode ? 'transparent' : '#e5e7eb'
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: isDarkMode ? '#374151' : '#e5e7eb',
          bgcolor: isDarkMode ? '#111827' : '#f9fafb'
        }}
      >
        <Typography 
          variant="h6"
          sx={{
            color: isDarkMode ? '#f3f4f6' : '#111827'
          }}
        >
          Unassigned Clients ({clients.length})
        </Typography>
      </Box>
      <List>
        {clients.map((client) => (
          <ListItem
            key={client._id}
            sx={{
              borderBottom: 1,
              borderColor: isDarkMode ? '#374151' : '#e5e7eb',
              '&:last-child': {
                borderBottom: 0
              },
              '&:hover': {
                bgcolor: isDarkMode ? '#374151' : '#f3f4f6'
              },
              bgcolor: isDarkMode ? '#1f2937' : 'white',
              transition: 'background-color 0.2s ease'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Circle
                size={12}
                color={client.connected ? '#10b981' : '#ef4444'}
                fill={client.connected ? '#10b981' : '#ef4444'}
              />
            </Box>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    color: isDarkMode ? '#f3f4f6' : '#111844',
                    fontWeight: 500
                  }}
                >
                  {`${client.name}  (${client.computerName})`}
                </Typography>
              }
              secondary={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isDarkMode ? '#9ca3af' : '#6b7280'
                    }}
                  >
                    {client.connected ? 'Online' : 'Offline'}
                  </Typography>
                  {client.lastSeen && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: isDarkMode ? '#9ca3af' : '#6b7280'
                      }}
                    >
                      • Last seen: {new Date(client.lastSeen).toLocaleString()}
                    </Typography>
                  )}
                </Box>
              }
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value=""
                onChange={(e) => onAssignClient(client._id, e.target.value)}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: isDarkMode ? '#1f2937' : 'white',
                      '& .MuiMenuItem-root': {
                        bgcolor: isDarkMode ? '#1f2937' : 'white',
                        '&:hover': {
                          bgcolor: isDarkMode ? '#374151' : '#f3f4f6'
                        }
                      }
                    }
                  }
                }}
                sx={{
                  '& .MuiSelect-select': {
                    color: isDarkMode ? '#9ca3af' : '#6b7280'
                  },
                  bgcolor: isDarkMode ? '#1f2937' : 'white',
                  '&:hover': {
                    bgcolor: isDarkMode ? '#374151' : '#f3f4f6'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
                  }
                }}
              >
                <MenuItem 
                  value="" 
                  sx={{
                    color: isDarkMode ? '#f3f4f6' : '#6b7280',
                    fontWeight: 500
                  }}
                >
                  <Typography
                    sx={{
                      color: isDarkMode ? '#f3f4f6' : '#6b7280',
                      fontWeight: 500
                    }}
                  >
                    Assign to...
                  </Typography>
                </MenuItem>
                {organizations.map((org) => (
                  <MenuItem
                    key={org.id}
                    value=""
                    onMouseEnter={(e) => handleOrgHover(e, org)}
                    onMouseLeave={handleClose}
                    sx={{
                      fontWeight: 'bold',
                      color: '#3b82f6',
                      '&:hover': {
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
              <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="right-start"
                onMouseLeave={() => setIsSubmenuHovered(false)}
                onMouseEnter={() => setIsSubmenuHovered(true)}
                sx={{ zIndex: 9999 }}
              >
                <Paper
                  sx={{
                    bgcolor: isDarkMode ? '#1f2937' : 'white',
                    boxShadow: 1,
                    minWidth: 200,
                    mt: 0
                  }}
                >
                  {selectedOrg?.sites.map((site) => (
                    <MenuItem
                      key={`${selectedOrg.id}-${site.id}`}
                      value={`${selectedOrg.id}-${site.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignClient(client._id, `${selectedOrg.id}-${site.id}`);
                        handleClose();
                      }}
                      sx={{ 
                        color: isDarkMode ? '#f3f4f6' : '#111827',
                        '&:hover': {
                          bgcolor: isDarkMode ? '#374151' : '#f3f4f6'
                        }
                      }}
                    >
                      {site.name}
                    </MenuItem>
                  ))}
                </Paper>
              </Popper>
            </FormControl>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UnassignedClients; 