// import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Checkbox } from '@chakra-ui/react';
// import { Icon, TimeIcon } from '@chakra-ui/icons';
// import PropTypes from 'prop-types';
// import { useUserRedirect } from '../../hooks/UseUserRedirect';

// const DataGridHour = ({ data, onCheckboxClick, selectedItem }) => {
//     const { canCheckBox } = useUserRedirect();
//     const isEditableCommon = canCheckBox();

//     const formatDate = (dateTimeStr) => {
//         const date = new Date(dateTimeStr);
//         return [
//             date.getDate().toString().padStart(2, '0'),
//             (date.getMonth() + 1).toString().padStart(2, '0'),
//             date.getFullYear().toString()
//         ].join('/');
//     };

//     const formatTime = (dateTimeStr) => {
//         const time = new Date(dateTimeStr);
//         return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     return (
//         <TableContainer>
//             <Table size='md'>
//                 <Thead>
//                     <Tr>
//                         <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Data</Th>
//                         <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Hora</Th>
//                         <Th></Th>
//                     </Tr>
//                 </Thead>
//                 <Tbody>
//                     {data.map(item => (
//                         <Tr key={item.calendarioId}>
//                             <Td fontSize="18px" color="#3D5A73" fontWeight="bold" alignItems="center">
//                                 <Icon as={TimeIcon} color="green" mr="4" boxSize="6" alignItems="center" />
//                                 {formatDate(item.dataHoraConfigurada)}
//                             </Td>
//                             <Td fontSize="18px" color="#3D5A73" fontWeight="bold" alignItems="center">
//                                 {formatTime(item.dataHoraConfigurada)}</Td>
//                             {isEditableCommon && (
//                                 <Td>
//                                     <Checkbox
//                                         size='lg'
//                                         colorScheme='green'
//                                         isChecked={selectedItem && selectedItem.calendarioId === item.calendarioId}
//                                         onChange={() => onCheckboxClick(item.calendarioId, item.dataHoraConfigurada)}
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

// DataGridHour.propTypes = {
//     data: PropTypes.arrayOf(
//         PropTypes.shape({
//             calendarioId: PropTypes.number.isRequired,
//             dataHoraConfigurada: PropTypes.string.isRequired,
//         })
//     ).isRequired,
//     onCheckboxClick: PropTypes.func.isRequired,
//     selectedItem: PropTypes.shape({
//         calendarioId: PropTypes.number.isRequired,
//         dataHoraConfigurada: PropTypes.string.isRequired
//     }),
// };

// export default DataGridHour;

import { Flex, Text, Checkbox, Icon } from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import { useUserRedirect } from '../../hooks/UseUserRedirect';

const DataGridHour = ({ data, onCheckboxClick, selectedItem }) => {
    const { canCheckBox } = useUserRedirect();
    const isEditableCommon = canCheckBox();

    const formatDate = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return [
            date.getDate().toString().padStart(2, '0'),
            (date.getMonth() + 1).toString().padStart(2, '0'),
            date.getFullYear().toString()
        ].join('/');
    };

    const formatTime = (dateTimeStr) => {
        const time = new Date(dateTimeStr);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Flex wrap="wrap" gap="4">
            {data.map(item => (
                <Flex 
                    key={item.calendarioId} 
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
                        <Icon as={TimeIcon} color="green.500" boxSize="6" mr="4" />
                        <Flex direction="column">
                            <Text fontSize="18px" color="#3D5A73" fontWeight="bold">
                                {formatDate(item.dataHoraConfigurada)}
                            </Text>
                            <Text fontSize="18px" color="#3D5A73" fontWeight="bold">
                                {formatTime(item.dataHoraConfigurada)}
                            </Text>
                        </Flex>
                    </Flex>
                    {isEditableCommon && (
                        <Checkbox paddingLeft={5}
                            size='lg'
                            colorScheme='green'
                            isChecked={selectedItem && selectedItem.calendarioId === item.calendarioId}
                            onChange={() => onCheckboxClick(item.calendarioId, item.dataHoraConfigurada)}
                        />
                    )}
                </Flex>
            ))}
        </Flex>
    );
};

DataGridHour.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            calendarioId: PropTypes.number.isRequired,
            dataHoraConfigurada: PropTypes.string.isRequired,
        })
    ).isRequired,
    onCheckboxClick: PropTypes.func.isRequired,
    selectedItem: PropTypes.shape({
        calendarioId: PropTypes.number.isRequired,
        dataHoraConfigurada: PropTypes.string.isRequired
    }),
};

export default DataGridHour;
