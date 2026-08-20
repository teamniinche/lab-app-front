import { dbBaseRoot } from "../../assets/constantes";
export default async function getNormesFormules() {
                  try {
                      const response =await fetch(dbBaseRoot + "javel/get-normes", {
                      method: "GET",
                      headers: { 'Content-Type': 'application/json' }
                    });
                    const dt =await response.json();
                    const data = dt.data;
                    return data;
                }catch(error){
                    alert(error.message)
                }}