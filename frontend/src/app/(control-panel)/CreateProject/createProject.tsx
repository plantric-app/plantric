import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel
} from '@mui/material';

const initialStakeholder = { name: '', role: '' };

const CreateProject = ({ users = [] }) => {
  const [project, setProject] = useState({
    name: '',
    domain: '',
    desc: '',
    tech_stack: '',
    dev_methods: '',
    surveyMethod: [],
    nonFunctional: '',
    milestone: '',
    additional_instruction: '',
  });

  const [stakeholders, setStakeholders] = useState([initialStakeholder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleStakeholderChange = (index, field, value) => {
    const newStakeholders = [...stakeholders];
    if (field === 'name') {
      const selectedUser = users.find(user => user.id === value);
      newStakeholders[index].role = selectedUser?.role || '';
    }
    newStakeholders[index][field] = value;
    setStakeholders(newStakeholders);
  };

  const addStakeholder = () => {
    setStakeholders([...stakeholders, initialStakeholder]);
  };

  const removeStakeholder = (index) => {
    const updated = stakeholders.filter((_, i) => i !== index);
    setStakeholders(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...project, stakeholders };
    console.log('Form Submitted:', payload);
    // You can POST to your backend here
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Create Project</Typography>
      <Grid container spacing={2}>
        {/* Project Name */}
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="name" label="Project Name" value={project.name} onChange={handleChange} />
        </Grid>

        {/* Domain */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Domain</InputLabel>
            <Select name="domain" value={project.domain} label="Domain" onChange={handleChange}>
              {['Healthcare', 'Educational', 'Social Networking'].map((d) => (
                <MenuItem value={d} key={d}>{d}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <TextField fullWidth name="desc" label="Project Description" value={project.desc} onChange={handleChange} multiline rows={3} />
        </Grid>

        {/* Tech Stack */}
        <Grid item xs={12}>
          <TextField fullWidth name="tech_stack" label="Tech Stack" placeholder="e.g., Laravel, React, MySQL" value={project.tech_stack} onChange={handleChange} />
        </Grid>

        {/* Development Methods */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Development Method</InputLabel>
            <Select name="dev_methods" value={project.dev_methods} label="Development Method" onChange={handleChange}>
              {['Agile', 'Scrum', 'Waterfall', 'DevOps'].map(method => (
                <MenuItem value={method} key={method}>{method}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Survey Methods */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Survey Methods</InputLabel>
            <Select name="surveyMethod" multiple value={project.surveyMethod} onChange={handleChange}>
              {['Interviews', 'Workshops', 'Surveys', 'Observation'].map(method => (
                <MenuItem key={method} value={method}>{method}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Non-functional Requirements */}
        <Grid item xs={12}>
          <TextField fullWidth name="nonFunctional" label="Non-Functional Requirements" value={project.nonFunctional} onChange={handleChange} multiline rows={2} />
        </Grid>

        {/* Stakeholders Section */}
        <Grid item xs={12}>
          <Typography variant="h6" mt={2}>Stakeholders</Typography>
        </Grid>

        {stakeholders.map((s, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel>Stakeholder</InputLabel>
                <Select
                  value={s.name}
                  onChange={(e) => handleStakeholderChange(index, 'name', e.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField fullWidth label="Role" value={s.role} disabled />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth color="error" onClick={() => removeStakeholder(index)}>Remove</Button>
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="outlined" onClick={addStakeholder}>Add Stakeholder</Button>
        </Grid>

        {/* Milestones */}
        <Grid item xs={12}>
          <TextField fullWidth name="milestone" label="Project Milestones" value={project.milestone} onChange={handleChange} multiline rows={2} />
        </Grid>

        {/* Additional Instructions */}
        <Grid item xs={12}>
          <TextField fullWidth name="additional_instruction" label="Additional Instructions" value={project.additional_instruction} onChange={handleChange} multiline rows={2} />
        </Grid>

        {/* Submit */}
        <Grid item xs={12} md={2}>
          <Button fullWidth type="submit" variant="contained">Save</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateProject;
