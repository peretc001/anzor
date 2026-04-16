import React from 'react'

import { getProjectsApi } from '@/modules/projects/api/getProjectsApi'
import Main from '@/modules/projects/components/main/main'

const Projects = async () => {
  const projects = await getProjectsApi()

  return <Main projects={projects} />
}

export default Projects
