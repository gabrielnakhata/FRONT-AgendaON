// import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Checkbox } from '@chakra-ui/react';
// import PropTypes from 'prop-types';
// import { useUserRedirect } from '../../hooks/UseUserRedirect'

// const DataGridService = ({ data, onCheckboxClick, selectedItemService  }) => {
//     const { canCheckBox } = useUserRedirect();
//     const isEditableCommon = canCheckBox();

//     const formatCurrency = (value) => {
//         return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
//     };

//     return (
//         <TableContainer>
//             <Table size='md'>
//                 <Thead>
//                     <Tr>
//                         <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Nome</Th>
//                         <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Valor</Th>
//                         <Th></Th>
//                     </Tr>
//                 </Thead>
//                 <Tbody>
//                     {data.map(item => (
//                         <Tr key={item.servicoId}>
//                             <Td fontSize="18px" color="#3D5A73" fontWeight="bold" alignItems="center">
//                                 <i className="pi pi-clipboard" style={{ fontSize: '25px', verticalAlign: 'middle', color:'green'}} />
//                                 &nbsp; &nbsp;&nbsp;{item.nome}
//                             </Td>
//                             <Td fontSize="18px" color="#3D5A73" fontWeight="bold" alignItems="center">
//                                 {formatCurrency(parseFloat(item.valor))}
//                                 </Td>
//                             {isEditableCommon && (
//                                 <Td>
//                                     <Checkbox
//                                         size='lg'
//                                         colorScheme='green'
//                                         isChecked={selectedItemService.includes(item.servicoId)}
//                                         onChange={() => onCheckboxClick(item.servicoId)}
//                                     >
//                                     </Checkbox>
//                                 </Td>
//                             )}
//                         </Tr>
//                     ))}
//                 </Tbody>
//             </Table>
//         </TableContainer>
//     );
// };

// DataGridService.propTypes = {
//     data: PropTypes.arrayOf(
//         PropTypes.shape({
//             servicoId: PropTypes.number.isRequired,
//             nome: PropTypes.string.isRequired,
//             valor: PropTypes.string.isRequired,
//         })
//     ).isRequired,
//     onCheckboxClick: PropTypes.func.isRequired,
//     selectedItemService: PropTypes.number.isRequired,
// };

// export default DataGridService;

import { Flex, Text, Checkbox } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useUserRedirect } from '../../hooks/UseUserRedirect';

const DataGridHourService = ({ data, onCheckboxClick, selectedItemService }) => {
    const { canCheckBox } = useUserRedirect();
    const isEditableCommon = canCheckBox();

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <Flex paddingTop={2} paddingBottom={2} wrap="wrap" gap="4" justifyContent="center" background="#CECECECE">
            {data.map(item => (
                <Flex 
                    key={item.servicoId} 
                    direction="row" 
                    p="4" 
                    borderWidth="1px" 
                    borderRadius="lg" 
                    alignItems="center"
                    justifyContent="space-between"
                    boxShadow="sm"
                    bg="white"
                    width="fit-content"  
                >
                    <Flex alignItems="center">
                        <i className="pi pi-tag" style={{ fontSize: '24px', verticalAlign: 'middle', color: 'green' }} />
                        <Flex direction="column" paddingLeft={4}>
                            <Text fontSize="18px" color="#3D5A73" fontWeight="bold">
                                {item.nome}
                            </Text>
                            <Text fontSize="18px" color="#3D5A73" fontWeight="bold">
                                {formatCurrency(parseFloat(item.valor))}
                            </Text>
                        </Flex>
                    </Flex>
                    {isEditableCommon && (
                        <Checkbox paddingLeft={5}
                            size='lg'
                            colorScheme='green'
                            isChecked={selectedItemService.includes(item.servicoId)}
                            onChange={() => onCheckboxClick(item.servicoId)}
                        />
                    )}
                </Flex>
            ))}
        </Flex>
    );
};

DataGridHourService.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            servicoId: PropTypes.number.isRequired,
            nome: PropTypes.string.isRequired,
            valor: PropTypes.string.isRequired,
        })
    ).isRequired,
    onCheckboxClick: PropTypes.func.isRequired,
    selectedItemService: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default DataGridHourService;

