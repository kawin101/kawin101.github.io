'use client';
import { motion } from "framer-motion";

export default function SkillSection({ skills }) {
    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
    }, {});

    const categories = Object.keys(groupedSkills);

    return (
        <div className="row g-4">
            {categories.map((category, index) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={category}
                    className="col-md-6 mb-4"
                >
                    <div className="glass-panel p-4 h-100">
                        <h3 className="h5 text-primary border-bottom pb-2 mb-3">{category}</h3>
                        <div className="d-flex flex-wrap gap-2">
                            {groupedSkills[category].map(skill => (
                                <div key={skill.title} className="d-flex align-items-center bg-surface border px-3 py-2 rounded-pill hover-card">
                                    {skill.icon && <img src={skill.icon} alt="" width="20" height="20" className="me-2" />}
                                    <span className="fw-medium">{skill.title}</span>
                                    {/* Optional: Show proficiency bar if needed */}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
