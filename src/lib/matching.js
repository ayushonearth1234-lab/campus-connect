// ============================================================================
// CampusConnect - Skill Matching Module
// Academic implementation: Simple, explainable matching using SQL & JS array filtering
// ============================================================================

import { executeQuery } from './db';

/**
 * Finds matching students who offer skills that the given student wants to learn.
 * 
 * Logic:
 * 1. Fetch all skills wanted by the target student (student_id).
 * 2. Fetch all skills offered by OTHER students (student_id != target_id).
 * 3. Match by comparing skill_name (case-insensitive & trimmed) or category.
 * 4. Return an array of recommendations with match reason and instructor details.
 * 
 * @param {number} studentId - The ID of the student seeking matches
 * @returns {Promise<Array>} List of matched peer students and the matched skills
 */
export async function findSkillMatches(studentId) {
  if (!studentId) return [];

  // Step 1: Retrieve all 'wanted' skills for this student
  const wantedSkills = await executeQuery(
    `SELECT skill_id, skill_name, category, description 
     FROM skills 
     WHERE student_id = ? AND type = 'wanted'`,
    [studentId]
  );

  if (!wantedSkills || wantedSkills.length === 0) {
    return [];
  }

  // Step 2: Retrieve all 'offered' skills by other students along with student details
  const offeredSkills = await executeQuery(
    `SELECT 
       k.skill_id,
       k.student_id,
       k.skill_name,
       k.category,
       k.description,
       k.experience_level,
       k.availability,
       s.name AS student_name,
       s.email AS student_email,
       s.department AS student_department,
       s.year AS student_year,
       s.college AS student_college
     FROM skills k
     JOIN students s ON k.student_id = s.student_id
     WHERE k.type = 'offered' AND k.student_id != ?`,
    [studentId]
  );

  // Step 3: Match using simple JavaScript string normalization
  const matches = [];

  for (const wanted of wantedSkills) {
    const wantedName = wanted.skill_name.trim().toLowerCase();

    for (const offered of offeredSkills) {
      const offeredName = offered.skill_name.trim().toLowerCase();

      // Check if skill names match (e.g. "Python" in "Python Programming" or exact match)
      const isExactMatch = wantedName === offeredName;
      const isSubMatch = wantedName.includes(offeredName) || offeredName.includes(wantedName);

      if (isExactMatch || isSubMatch) {
        matches.push({
          match_id: `${wanted.skill_id}-${offered.skill_id}`,
          wanted_skill_id: wanted.skill_id,
          wanted_skill_name: wanted.skill_name,
          offered_skill_id: offered.skill_id,
          offered_skill_name: offered.skill_name,
          category: offered.category,
          experience_level: offered.experience_level,
          availability: offered.availability,
          instructor_id: offered.student_id,
          instructor_name: offered.student_name,
          instructor_email: offered.student_email,
          instructor_department: offered.student_department,
          instructor_year: offered.student_year,
          instructor_college: offered.student_college,
          match_badge: `Match Found! ${offered.student_name} can teach you ${offered.skill_name}.`
        });
      }
    }
  }

  return matches;
}

