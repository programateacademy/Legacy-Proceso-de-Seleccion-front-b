import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../auth/Spinner";
import { getFormAll } from "../../actions/userAction";
import Technincaltest from "./TechnicalTestAspirant.module.css";
import { Link } from "react-router-dom";
import { PETITIONS } from "../../../requestUrl";

const TechnicalTestAspirant = () => {
	const { user } = useSelector((state) => state.auth);
	const [spinner, setSpinner] = useState(false);
	const [existTechTest, setExistTechTest] = useState([]);
	const dispatch = useDispatch();
	const [userInConvocatory, setUserInConvocatory] = useState([]);
	const [testToUser, setTestToUser] = useState([]);

	useEffect(() => {
		try {
			axios
				.get(`${PETITIONS.verifyTechTest}${user._id}`)
				.then((res) => setExistTechTest([res.data]));
		} catch (error) {
			console.log(error);
		}
	}, [user]);

	useEffect(() => {
		try {
			axios.get(PETITIONS.getConvocatories, {}).then((res) => {
				setUserInConvocatory(res.data);
			});
		} catch (error) {
			return error;
		}
		try {
			axios.get(PETITIONS.getTechTest).then((res) => setTestToUser(res.data));
		} catch (error) {
			return error;
		}
	}, [user]);

	const [testTech, setTechTest] = useState("");
	const handleChange = (e) => {
		const techTest = e.target.value;
		setTechTest(techTest);
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		setSpinner(true);
		try {
			await axios.patch(`${PETITIONS.sendTechTest}${user._id}`, {
				techTest: testTech,
			});
		} catch (error) {
			return error;
		}
		setTechTest("");
		setTimeout(() => {
			window.location.reload();
			setSpinner(false);
		}, 2000);
	};

	useEffect(() => {
		dispatch(getFormAll(user?.id));
	}, [dispatch, user]);

	let registrado = [];

	userInConvocatory.map(({usersRegistered}) => usersRegistered.includes(user._id) ? registrado.push(true) : registrado.push(false))

	return (
		<>
			<div className='technical__test'>
				<div className='technical__test-upload test'>
					<h4 className='title__test'>Descargar prueba tecnica</h4>
					<div className='content__test download'>
						<p className='mb-4'>
							Dale clic en el boton para descargar la prueba técnica, y recuerda
							subir la solucion en el tiempo estipulado.
						</p>
						<div>
							{!registrado.includes(true) ? <p>Antes de enviar una prueba técnica porfavor registrese en una convocatoria <Link to="/Convocatoriasaspirante">AQUI</Link> recuerde que solo tiene una oportunidad de enviar el enlace</p>: null}
							{userInConvocatory.map(({ usersRegistered, _id }) =>
								testToUser.map(({ convocatories, title, url }, index) =>
									usersRegistered.includes(user._id) &&
									convocatories.includes(_id)
										? <a key={index} href={url} target='_blank' className="btn btn-warning mb-3">
                        Prueba tecnica: { title }
                      </a>
										: null
								)
							)}
						</div>
					</div>
				</div>
				{spinner && <Spinner />}

				<div className='technical__test-download test'>
					<h4 className='mb-3'>Cargar tu prueba tecnica</h4>
					<div className='content__test'>
						<p className='text__upload mb-3'>
							Por favor ingresa el enlace del drive de tu prueba tecnica y
							asegurate que se encuentre publico. Solo tiene una oportunidad de
							enviar el enlace
						</p>
						<p>
							Recuerda que para enviar la prueba tecnica primero debes de
							diligenciar el formulario de aspirante{" "}
							<Link to='inscripcion'>Clic aqui para hacerlo</Link>
						</p>
					</div>
					<div className='form__upload'>
            {registrado.includes(true) ?      
              <form onSubmit={onSubmit}>
                <p>Ingresa la URL:</p>
                <div className='input-group mb-3'>
                  <span className='input-group-text' id='basic-addon1'>
                    @
                  </span>
                  <input
                    onChange={handleChange}
                    name='linktest'
                    type='text'
                    className='form-control'
                    placeholder='https://drive.google.com/drive'
                    aria-label='Username'
                    aria-describedby='basic-addon1'
                    required
                  />
                </div>
                {existTechTest?.map((element, index) =>
                  !element.techTest ||
                  element.techTest === undefined ||
                  element.techTest === null ? (
                    <button
                      key={index}
                      className='btn btn-warning'
                      type='submit'
                      value='Enviar prueba'
                    >
                      Enviar
                    </button>
                  ) : (
                    <p key={index} className='sendProof'>
                      Ya enviaste la prueba
                    </p>
                  )
                )}
              </form>
              :
              <p>Este campo se habilitara cuando usted se registre en una convocatoria <Link to="/Convocatoriasaspirante">Clic aqui para registrarse</Link> recuerde que solo tiene una oportunidad de enviar el enlace</p>
            }
					</div>
				</div>
			</div>
		</>
	);
};

export default TechnicalTestAspirant;
