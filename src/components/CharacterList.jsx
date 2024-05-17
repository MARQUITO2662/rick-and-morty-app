import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css';

const CharacterList = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [speciesFilter, setSpeciesFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${currentPage}`);
                setCharacters(response.data.results);
                setTotalPages(response.data.info.pages);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching the characters:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage]);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    };

    const handleStatusFilter = event => {
        setStatusFilter(event.target.value);
    };

    const handleSpeciesFilter = event => {
        setSpeciesFilter(event.target.value);
    };

    const filteredCharacters = characters.filter(character =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === '' || character.status === statusFilter) &&
        (speciesFilter === '' || character.species === speciesFilter)
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Rick and Morty Characters</h1>
            <input
                type="text"
                placeholder="Search characters"
                value={searchTerm}
                onChange={handleSearch}
            />
            <select onChange={handleStatusFilter} value={statusFilter}>
                <option value="">All Statuses</option>
                <option value="Alive">Alive</option>
                <option value="Dead">Dead</option>
                <option value="unknown">Unknown</option>
            </select>
            <select onChange={handleSpeciesFilter} value={speciesFilter}>
                <option value="">All Species</option>
                <option value="Human">Human</option>
                <option value="Alien">Alien</option>
                {/* Añade más opciones según sea necesario */}
            </select>
            <div className="character-grid">
                {filteredCharacters.map(character => (
                    <div key={character.id} className="character-card">
                        <img src={character.image} alt={character.name} />
                        <h2>{character.name}</h2>
                        <p>Status: {character.status}</p>
                        <p>Species: {character.species}</p>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default CharacterList;
