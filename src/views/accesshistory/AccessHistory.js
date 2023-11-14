import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setReloadData } from 'store/actions';
import { reloadDataSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import { GetAllUserInAccessHistory, getHistoryAccess } from 'services/accesshistoryService';
import React from 'react';
import { convertISODateTimeToFormattedDateTime } from 'utils/formatDate';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { IconFileExport, IconSearch } from '@tabler/icons';
import * as XLSX from 'xlsx';
import BackToTop from 'components/scroll/BackToTop';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { getActionsByFunctionId, getAllFunction } from 'services/sharedService';
import { format, subMonths } from 'date-fns';
const HistoryAccess = () => {
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAccess, setIsAccess] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const [search, setSearch] = useState(false);
  const [data, setData] = useState([]);
  const [functions, setFunctions] = useState('');
  const [actions, setActions] = useState('');
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    fromDate: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    toDate: format(new Date(), 'yyyy-MM-dd'),
    idUser: '',
    userName: '',
    function: '',
    action: ''
  });

  const columns = [
    {
      field: 'rowIndex',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 2,
      field: 'fullName',
      headerName: t('user.field.fullname'),
      minWidth: 180
    },
    {
      flex: 1,
      field: 'userName',
      headerName: t('user.field.username'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'function',
      headerName: t('Chức năng'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'action',
      headerName: t('Hành động'),
      minWidth: 100
    },
    {
      flex: 1.5,
      field: 'LoginOn_fm',
      headerName: t('LoginOn'),
      minWidth: 160
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllUserInAccessHistory();
      setData(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataDL = async () => {
      const functions = await getAllFunction();
      console.log(functions);
      if (functions.data && functions.data.length > 0) {
        setFunctions(functions.data);
      } else {
        setFunctions('');
      }
    };
    fetchDataDL();
  }, []);

  useEffect(() => {
    console.log(pageState.function);
  }, [pageState.function]);

  useEffect(() => {
    const fetchDataDL = async () => {
      const response = await getActionsByFunctionId(pageState.function);
      if (response.data && response.data.length > 0) {
        setActions(response.data);
        setPageState((old) => ({ ...old, action: '' }));
      } else {
        setActions('');
      }
    };
    if (pageState.function != '') {
      fetchDataDL();
    }
  }, [pageState.function]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('FromDate', pageState.fromDate);
      params.append('ToDate', pageState.toDate);
      params.append('userName', pageState.userName);
      params.append('Function', pageState.function);
      params.append('Action', pageState.action);
      const response = await getHistoryAccess(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.map((row, index) => ({
          id: index + 1,
          LoginOn_fm: row.accessTime == null ? 'Chưa truy cập ' : convertISODateTimeToFormattedDateTime(row.accessTime),
          ...row
        }));
        // Lưu trữ dữ liệu gốc vào state
        dispatch(setReloadData(false));
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: dataWithIds,
          total: dataWithIds[0]?.totalRow || 0
        }));
      } else {
        setIsAccess(false);
      }
    };
    fetchData();
    setSearch(false);
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search]);

  const handleSearch = () => {
    setSearch(true);
  };

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const params = new URLSearchParams();
    params.append('Order', 1);
    params.append('OrderDir', 'ASC');
    params.append('StartIndex', '0');
    params.append('PageSize', -1);
    params.append('FromDate', pageState.fromDate);
    params.append('ToDate', pageState.toDate);
    params.append('Username', pageState.userName);
    params.append('Function', pageState.function);
    params.append('Action', pageState.action);
    const response = await getHistoryAccess(params);
    const formattedData = response.data.map((item) => ({
      STT: item.rowIndex,
      'Họ và Tên': item.fullName,
      'Tài Khoản': item.userName,
      'Hành động': item.action,
      'Chức năng': item.function,
      'Thời gian truy cập': convertISODateTimeToFormattedDateTime(item.accessTime)
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HistoryAccessData');
    // Điều chỉnh chiều rộng của các cột trong file xuất ra
    const columnsWidth = [
      { wch: 10 }, // Chiều rộng cột 'serial'
      { wch: 30 }, // Chiều rộng cột 'user.field.fullname'
      { wch: 20 }, // Chiều rộng cột 'user.field.username'
      { wch: 30 }, // Chiều rộng cột 'user.field.username'
      { wch: 20 }, // Chiều rộng cột 'user.field.username'
      { wch: 20 } // Chiều rộng cột 'LoginOn'
    ];

    worksheet['!cols'] = columnsWidth;
    XLSX.writeFile(workbook, 'history_access_data.xlsx');
    dispatch(setLoading(false));
  };

  const handleUserNameChange = (event) => {
    const Value = event.target.value;
    const userId = Value === 'TaiKhoan' ? 0 : Value;
    setPageState((old) => ({ ...old, idUser: userId }));
    const selectedUser = data.find((item) => item.userId === Value);
    if (selectedUser) {
      const ten = selectedUser.userName;
      setPageState((old) => ({ ...old, userName: ten }));
    } else {
      setPageState((old) => ({ ...old, userName: '' }));
    }
  };

  return (
    <>
      <MainCard
        title={t('AccessHistory')}
        secondary={
          <Grid item>
            <ButtonSuccess title={t('button.export')} onClick={handleExport} icon={IconFileExport} />
          </Grid>
        }
      >
        <Grid container justifyContent="center" mb={1} spacing={1}>
          <Grid item xs={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('Chức năng')}</InputLabel>
              <Select
                name="function"
                value={pageState.function}
                onChange={(e) => setPageState((old) => ({ ...old, function: e.target.value }))}
                label={t('chức năng')}
              >
                {functions && functions.length > 0 ? (
                  functions.map((data) => (
                    <MenuItem key={data.functionId} value={data.functionId}>
                      {data.description}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('Hành động')}</InputLabel>
              <Select
                label={t('Hành động')}
                name="action"
                value={pageState.action}
                onChange={(e) => setPageState((old) => ({ ...old, action: e.target.value }))}
              >
                {actions && actions.length > 0 ? (
                  actions.map((data) => (
                    <MenuItem key={data.functionActionId} value={data.functionActionId}>
                      {data.action}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">{t('selected.nodata')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Tài khoản </InputLabel>
              <Select
                name="userId"
                value={pageState.idUser == 0 ? 'TaiKhoan' : pageState.idUser}
                onChange={handleUserNameChange}
                label="Tài khoản"
              >
                <MenuItem value="TaiKhoan">Tất cả người dùng</MenuItem>
                {data && data.length > 0 ? (
                  data.map((taikhoan) => (
                    <MenuItem key={taikhoan.userId} value={taikhoan.userId}>
                      {taikhoan.userName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No data available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth variant="outlined">
              <TextField
                size="small"
                name="fromDate"
                type="date"
                label={t('fromDate')}
                onChange={(e) => setPageState((old) => ({ ...old, fromDate: e.target.value }))}
                onBlur={() => {
                  if (pageState.toDate < pageState.fromDate) {
                    setPageState({ ...pageState, toDate: pageState.fromDate });
                  }
                }}
                value={pageState.fromDate}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth variant="outlined">
              <TextField
                size="small"
                name="toDate"
                type="date"
                label={t('toDate')}
                onChange={(e) => setPageState((old) => ({ ...old, toDate: e.target.value }))}
                inputProps={{
                  min: pageState.fromDate
                }}
                value={pageState.toDate}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
          </Grid>
          <Grid item mt={'1px'} mb={1}>
            <Button variant="contained" title="Tìm kiếm" color="info" onClick={handleSearch} startIcon={<IconSearch />}>
              {t('button.search')}
            </Button>
          </Grid>
        </Grid>
        {isAccess ? (
          <DataGrid
            autoHeight
            columns={columns}
            rows={pageState.data}
            rowCount={pageState.total}
            loading={pageState.isLoading}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            pagination
            page={pageState.startIndex}
            pageSize={pageState.pageSize}
            paginationMode="server"
            onPageChange={(newPage) => {
              setPageState((old) => ({ ...old, startIndex: newPage }));
            }}
            onPageSizeChange={(newPageSize) => {
              setPageState((old) => ({ ...old, pageSize: newPageSize }));
            }}
            onSortModelChange={(newSortModel) => {
              const field = newSortModel[0]?.field;
              const sort = newSortModel[0]?.sort;
              setPageState((old) => ({ ...old, order: field, orderDir: sort }));
            }}
            onFilterModelChange={(newSearchModel) => {
              const value = newSearchModel.items[0]?.value;
              setPageState((old) => ({ ...old, search: value }));
            }}
            localeText={language === 'vi' ? localeText : null}
            disableSelectionOnClick={true}
          />
        ) : (
          <h1>{t('not.allow.access')}</h1>
        )}
      </MainCard>{' '}
      <BackToTop />
    </>
  );
};

export default HistoryAccess;
