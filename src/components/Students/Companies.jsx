import React from 'react';
import { Link } from 'react-router-dom';
import { company as companies } from '../../assets/companiesdata';
// Logos (replace these with your local assets or URLs as needed)


const Companies = () => {
    return (
        <section className="bg-black text-white px-4 py-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-[Outfit] mb-10">
                Top <span className="text-teal-400 font-medium">companies</span> our students<br className="hidden sm:block" /> working with
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-10 place-items-center my-12">
                {companies.map((company, idx) => (
                    <a
                        key={idx}
                        href={company.url}
                        target="_blank"
                        rel="noreferrer"
                        className="opacity-90 hover:opacity-100 transition duration-200"
                    >
                        <img
                            src={company.logo}
                            alt={company.name}
                            className="h-10  md:h-12 object-contain"
                        />
                        <p>{company.name}</p>
                    </a>
                ))}
            </div>

            <Link
                to="/courses"
                className="bg-teal-400 hover:bg-teal-300 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
                Explore Courses
            </Link>
        </section>
    );
};

export default Companies;
