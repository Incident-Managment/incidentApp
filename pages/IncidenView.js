import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../components/Footer';
import ModalSelector from '../components/ModalSelector';

const IncidenciasList = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [filteredIncidencias, setFilteredIncidencias] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          const companyId = parsedUser.user.company.id;

          const response = await fetch(`https://back.incidentstream.cloud/api/incidents/incidentsByCompany?companyId=${companyId}`);
          const data = await response.json();
          setIncidencias(data);
          setFilteredIncidencias(data);
        }
      } catch (error) {
        console.error('Error al obtener las incidencias:', error);
      }
    };

    fetchIncidencias();
  }, []);

  useEffect(() => {
    filterIncidencias();
  }, [selectedPriority, selectedStatus]);

  const filterIncidencias = () => {
    let filtered = incidencias;

    if (selectedPriority) {
      filtered = filtered.filter(item => item.priority.name === selectedPriority);
    }

    if (selectedStatus) {
      filtered = filtered.filter(item => item.status.name === selectedStatus);
    }

    setFilteredIncidencias(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, getPriorityStyle(item.priority.name)]}
      onPress={() => navigation.navigate('DetalleIncidencia', { incidencia: item })}
    >
      <Text style={styles.titulo}>{item.title}</Text>
      <Text style={styles.descripcion}>{item.description}</Text>
      <Text style={styles.info}>Responsable: {item.user.name}</Text>
      <Text style={styles.info}>Categoría: {item.category.name}</Text>
      <Text style={[styles.estado, getEstadoStyle(item.status.name)]}>{item.status.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredIncidencias}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <View style={styles.filters}>
        <ModalSelector
          options={[
            { label: 'Todas las Prioridades', value: '' },
            { label: 'Alta', value: 'Alta' },
            { label: 'Media', value: 'Media' },
            { label: 'Baja', value: 'Baja' },
          ]}
          selectedValue={selectedPriority}
          onValueChange={setSelectedPriority}
          placeholder="Seleccionar Prioridad"
        />
        <ModalSelector
          options={[
            { label: 'Todos los Estados', value: '' },
            { label: 'Resuelto', value: 'Resuelto' },
            { label: 'En Espera', value: 'En Espera' },
          ]}
          selectedValue={selectedStatus}
          onValueChange={setSelectedStatus}
          placeholder="Seleccionar Estado"
        />
      </View>
      <Footer />
    </View>
  );
};

const getPriorityStyle = (prioridad) => {
  switch (prioridad) {
    case 'Alta': return { borderLeftColor: 'red' };
    case 'Media': return { borderLeftColor: 'orange' };
    case 'Baja': return { borderLeftColor: 'green' };
    default: return {};
  }
};

const getEstadoStyle = (estado) => {
  switch (estado) {
    case 'Resuelto': return { color: 'green' };
    case 'En Espera': return { color: 'orange' };
    default: return { color: 'gray' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '48%',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 5,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
  },
  info: {
    fontSize: 12,
    color: '#888',
  },
  estado: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default IncidenciasList;