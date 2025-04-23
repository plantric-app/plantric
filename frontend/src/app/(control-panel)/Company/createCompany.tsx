import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { Toaster, toast } from 'react-hot-toast';

const CreateCompany = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');

  const handleInvite = async () => {
    if (!adminEmail || !adminName) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    const payload = {
      username: adminName,
      email: adminEmail
    };
  
    try {
      const res = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Something went wrong');
      }
  
      const data = await res.json();
      console.log("✅ Invite Sent:", data);
      toast.success(`Invite sent to ${adminName}`);
  
        // Reset the form fields
      setAdminEmail('');
      setAdminName('');
    } catch (error: any) {
      console.error("❌ Error sending invite:", error);
      toast.error(error.message || "Something went wrong.");
    }
  };
  

  return (
    // <Box sx={{ px: 4, py: 6, maxWidth: 600, mx: 'auto' }}>
    <Box sx={{ px: 4, py: 6, maxWidth: 800, mx: 'auto' }}>
      {/* This is where the Toaster should live */}
      <Toaster
  position="top-center"
  toastOptions={{
    style: {
      fontSize: '0.95rem',
      borderRadius: '10px',
    //   padding: '18px 18px',
      background: '#333',
      color: '#fff',
    },
  }}
  containerStyle={{ marginTop: '50px' }}
/>

      <Typography variant="h4" gutterBottom fontWeight={600}>
        Add a New Company
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Enter company details to invite the organization admin.
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Admin Name"
            variant="standard"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Admin Email"
            type="email"
            variant="standard"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            size="large"
            onClick={handleInvite}
            endIcon={<Send />}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Send Invite
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateCompany;
