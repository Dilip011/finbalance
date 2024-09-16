import React from 'react';
import { collection, doc, query, where, getDocs, setDoc, serverTimestamp, orderBy, deleteDoc, updateDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { db } from './firebaseconfig';
import { useState, useEffect, useCallback, useRef } from 'react';

const Trialbalance = () => {
  const [debitAmount, setDebitAmount] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [tableRow, setTableRow] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSno, setSelectedSno] = useState(null);
  const [updatedSno, setUpdatedSno] = useState('');
  const [updatedDebitStatement, setUpdatedDebitStatement] = useState('');
  const [updatedDebitAmount, setUpdatedDebitAmount] = useState('');
  const [updatedCreditAmount, setUpdatedCreditAmount] = useState('');
  const { data } = useParams();
  const database = db;

  function splitStringIntoLines(text) {
    return text.replace(/ {3,}/g, '\n');
  }

  function splitStringIntoLinesAndConvertToNumber(text) {
    const elements = text.split(/\s+/);
    let result = '';

    for (const element of elements) {
      const numberValue = parseFloat(element);
      if (!isNaN(numberValue) && isFinite(numberValue)) {
        result += numberValue + '\n';
      } else {
        result += element + ' ';
      }
    }
    return result.trim();
  }

  let isDataPopulated = useRef(false);

  const fetchAndPopulateTable = useCallback(async (user_id) => {
    if (isDataPopulated.current) {
      return;
    }

    const collectionRef = collection(db, 'trialbalance');
    const q = query(collectionRef, where('user_id', '==', user_id), orderBy("timestamp", 'asc'));
    const querySnapshot = await getDocs(q);

    const dataArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataArray.push(data);
    });
    setTableRow(dataArray);

    isDataPopulated.current = true;
  }, []);

  loadInitialData(data)

  function loadInitialData(user_id) {
    fetchAndPopulateTable(user_id);
  }

  async function addData() {
    let sno = document.sample.sno.value;
    let particulars_for_debit = document.sample.particulars_for_debit.value;
    let amount_debit = document.sample.amount_debit.value;
    let amount_credit = document.sample.amount_credit.value;

    if (
      sno === '' ||
      particulars_for_debit === '' ||
      amount_debit === ''
    ) {
      return;
    }

    var tr = document.createElement('tr');
    var td1 = tr.appendChild(document.createElement('td'))
    var td2 = tr.appendChild(document.createElement('td'));
    var td3 = tr.appendChild(document.createElement('td'));
    var td4 = tr.appendChild(document.createElement('td'));

    td1.innerHTML = sno;
    const debitStatementWithLineBreaks = splitStringIntoLines(particulars_for_debit);
    const debitparagraphs = debitStatementWithLineBreaks.split('\n').map((line, index) => (
      `<p key=${index}>${line}</p>`
    ));

    const debitAmountWithLineBreaks = splitStringIntoLinesAndConvertToNumber(amount_debit);
    const debitamountparagraphs = debitAmountWithLineBreaks.split('\n').map((line, index) => (
      `<p key=${index}>${line}</p>`
    ));

    const creditAmountWithLineBreaks = splitStringIntoLinesAndConvertToNumber(amount_credit);
    const creditamountparagraphs = creditAmountWithLineBreaks.split('\n').map((line, index) => (
      `<p key=${index}>${line}</p>`
    ));

    td2.innerHTML = debitparagraphs.join('<br>');
    td3.innerHTML = debitamountparagraphs;
    td4.innerHTML = creditamountparagraphs;

    // td2.innerHTML = debitparagraphs


    document.getElementById("journal_data").appendChild(tr);

    try {
      const docRef = doc(collection(database, 'trialbalance'));
      await setDoc(docRef, {
        sno: sno,
        debit_statement: particulars_for_debit,
        debit_amount: amount_debit,
        credit_statement: '',
        credit_amount: amount_credit,
        user_id: data,
        timestamp: serverTimestamp(),
      })
      document.sample.sno.value = ''
      document.sample.particulars_for_debit.value = ''
      document.sample.amount_debit.value = ''
      document.sample.amount_credit.value = ''

      isDataPopulated = false;
      getAmountForMatchingUser(data);
    } catch (error) {
      console.error('Error adding data to Firestore: ', error);
    }
  }

  const getAmountForMatchingUser = useCallback(async (user_id) => {
    try {
      const collectionRef = collection(db, 'trialbalance');
      const q = query(collectionRef, where('user_id', '==', user_id), orderBy("timestamp", 'asc'));
      const querySnapshot = await getDocs(q);
      let totaldebit = 0;
      let totalcredit = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        const fields = ['debit_amount', 'credit_amount'];

        fields.forEach((fieldName) => {
          if (fieldName in data) {
            const values = data[fieldName].split(/\s+/);
            values.forEach((value) => {
              const amount = parseFloat(value);
              if (!isNaN(amount)) {
                if (fieldName === 'debit_amount') {
                  totaldebit += amount;
                } else if (fieldName === 'credit_amount') {
                  totalcredit += amount;
                }
              }
            });
          }
        });
      });

      setDebitAmount(totaldebit);
      setCreditAmount(totalcredit);
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  }, []);

  const handleDelete = async (snoToDelete) => {
    try {
      const q = query(collection(db, 'trialbalance'), where('sno', '==', snoToDelete));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      updateTable();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const updateTable = async () => {
    try {
      const q = query(collection(db, 'trialbalance'));
      const querySnapshot = await getDocs(q);

      const updatedTableData = [];
      let updatedDebitAmount = 0;
      let updatedCreditAmount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        updatedTableData.push(data);

        updatedDebitAmount += parseFloat(data.debit_amount);
        updatedCreditAmount += parseFloat(data.credit_amount);
      });

      setTableRow(updatedTableData);
      setDebitAmount(updatedDebitAmount);
      setCreditAmount(updatedCreditAmount);
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

  const handleEdit = (sno) => {
    setIsEditMode(true);
    setSelectedSno(sno);
  };

  const handleUpdate = async () => {
    try {
      const q = query(collection(db, 'trialbalance'), where('sno', '==', selectedSno));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (document) => {
        const docRef = doc(db, 'trialbalance', document.id);

        await updateDoc(docRef, {
          sno: updatedSno,
          debit_statement: updatedDebitStatement,
          debit_amount: updatedDebitAmount,
          credit_statement: '',
          credit_amount: updatedCreditAmount,
        });
      });

      const rows = document.querySelectorAll('table tbody tr');

      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const snoCell = cells[0];

        if (snoCell.textContent === selectedSno) {
          cells[0].textContent = updatedSno;
          cells[1].innerHTML = '';

          if (updatedDebitStatement) {
            cells[1].innerHTML += `<div class="debit-statement">${splitStringIntoLines(updatedDebitStatement)}</div>`;
          }

          cells[2].textContent = updatedDebitAmount;
          cells[3].textContent = updatedCreditAmount;
          cells[4].textContent = data;
        }
      });

      setIsEditMode(false);
      setSelectedSno(null);

      document.querySelector('input[name="SNO"]').value = '';
      document.querySelector('textarea[name="PARTICULARS_FOR_DEBIT"]').value = '';
      document.querySelector('textarea[name="AMOUNT_DEBIT"]').value = '';
      document.querySelector('textarea[name="AMOUNT_CREDIT"]').value = '';
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const renderTable = () => {
    return (
      <div className='journal_table'>
        <table className='content_table'>
          <thead>
            <tr>
              <th>Sno</th>
              <th>Particulars</th>
              <th>Debit</th>
              <th>Credit</th>
              <th className='nothing'></th>
              <th className='nothing'></th>
            </tr>
          </thead>
          <tbody id='journal_data'>
            {tableRow.map((item, index) => (
              <tr key={index} className='table_row'>
                <td className='table_data tab1'>{item.sno}</td>
                <td className='table_data tab1'>
                  {splitStringIntoLines(item.debit_statement)}
                  
                </td>
                <td className='table_data tab1'>{splitStringIntoLinesAndConvertToNumber(item.debit_amount)}</td>
                <td className='table_data tab1'>{splitStringIntoLinesAndConvertToNumber(item.credit_amount)}</td>
                <td className='table_data'>
                  <button className='handleEdit' onClick={() => handleEdit(item.sno)}>Edit</button>
                </td>
                <td className='table_data'>
                  <button className='handleDelete' onClick={() => handleDelete(item.sno)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total_line">
          <p className="final_total_tag">Total:</p>
          <p className="final_total_value total_debit">{debitAmount}</p>
          <p className="final_total_value total_credit">{creditAmount}</p>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (isEditMode) {
      return (
        <div id='update_data'>
          <form method='post' name='update_sample'>
            <input
              name='SNO'
              type='text'
              id='txt'
              placeholder='SNO'
              autoComplete='off'
              onChange={(e) => setUpdatedSno(e.target.value)}
              required
            />
            <textarea
              name="PARTICULARS_FOR_DEBIT"
              id="txt"
              placeholder="Enter the Particulars for Debit"
              rows="1"
              autoComplete="off"
              onChange={(e) => setUpdatedDebitStatement(e.target.value)}
              required
            />
            <textarea
              name="AMOUNT_DEBIT"
              id="txt"
              placeholder="Enter the Amount for debit"
              rows="1"
              autoComplete="off"
              onChange={(e) => setUpdatedDebitAmount(e.target.value)}
              required
            />
            <textarea
              name="AMOUNT_CREDIT"
              id="txt"
              placeholder="Enter the Amount for credit"
              rows="1"
              autoComplete="off"
              onChange={(e) => setUpdatedCreditAmount(e.target.value)}
              required
            />
            <input
              name='update_data_button'
              id='btn'
              type="button"
              value="Update Data"
              onClick={handleUpdate}
            />
          </form>
        </div>
      );
    } else {
      return (
        <div id='add_data'>
          <form method='post' name='sample'>
            <input name='sno' type='text' id='txt' placeholder='SNO' autoComplete='off' required />
            <textarea
              name="particulars_for_debit"
              id="txt"
              placeholder="Enter the Particulars for Debit"
              rows="1"
              autoComplete="off"
              required
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <textarea
              name="amount_debit"
              id="txt"
              placeholder="Enter the Amount for debit"
              rows="1"
              autoComplete="off"
              required
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <textarea
              name="amount_credit"
              id="txt"
              placeholder="Enter the Amount for credit"
              rows="1"
              autoComplete="off"
              required
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
            />
            <input name='data_button' id='btn' type="button" value="Add Data" onClick={addData} />
          </form>
        </div>
      );
    }
  };

  useEffect(() => {
    getAmountForMatchingUser(data);
  }, [data, getAmountForMatchingUser]);

  useEffect(() => {
    if (data) {
      fetchAndPopulateTable(data);
    }
  }, [data, fetchAndPopulateTable]);

  return (
    <div className='fullpage'>
      {renderForm()}
      {renderTable()}
    </div>
  );
};

export default Trialbalance;

