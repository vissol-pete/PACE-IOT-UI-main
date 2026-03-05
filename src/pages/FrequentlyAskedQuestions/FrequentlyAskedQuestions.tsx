import { useEffect } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, Link } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { InfoFooter } from "../../features";

import { setBreadcrumbText, setHeaderText } from "../../redux/Slice/Navigation/NavigationSlice";
// import { fetchQuickStartNotesFile, fetchGeneralSchematicsFile } from "../../services/apis";

export default function FrequentlyAskedQuestions() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadcrumbText(["FAQ"]));
    dispatch(setHeaderText("Frequently Asked Questions"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const {
  //   data: quickStartNotesFilesData,
  //   isLoading: isQuickStartNotesFileLoading,
  //   // isSuccess: isQuickStartNotesFileSuccess,
  // } = useQuery({
  //   queryKey: ["quickStartNotesFile"],
  //   queryFn: fetchQuickStartNotesFile,
  //   refetchOnWindowFocus: false,
  // });

  // const {
  //   data: generalSchematicsData,
  //   isLoading: isGeneralSchematicsLoading,
  //   // isSuccess: isGeneralSchematicsSuccess,
  // } = useQuery({
  //   queryKey: ["generalSchematicsFile"],
  //   queryFn: fetchGeneralSchematicsFile,
  //   refetchOnWindowFocus: false,
  // });

  // console.log(
  //   "quickStartNotesFilesData",
  //   quickStartNotesFilesData,
  //   isQuickStartNotesFileLoading,
  //   isQuickStartNotesFileSuccess
  // );

  // console.log(
  //   "generalSchematicsData",
  //   generalSchematicsData,
  //   isGeneralSchematicsLoading,
  //   isGeneralSchematicsSuccess
  // );

  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '92vh' }}>
      <Box sx={{
        marginLeft: '24px',
        marginRight: '24px',
        marginTop: '16px',
        boxShadow: 1,
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: 'transparent'
      }}>
        {/*   {isQuickStartNotesFileLoading && isGeneralSchematicsLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
            marginBottom: "10px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
       <>*/}
        <Accordion sx={{ boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            What are the capabilities of PACE AI cloud-based AI/ML and edge nodes?
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              PACE AI can deliver a wide range of smart gateway and AI/ML optimization and control features. Check out the{" "}
              <Link href="https://www.pacecontrols.com" target="_blank" rel="noopener">
                PACE AI website
              </Link>{" "}
              for more details.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            How do building energy savings translate to my business?
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              The specific translation depends on your specific business. However, EPA and DOE have done a great deal of research, and they say the
              following, as examples -- for more information, see the ENERGY STAR Website,{" "}
              <Link href="https://www.energystar.gov" target="_blank" rel="noopener">
                www.energystar.gov.
              </Link>
              <br />
              <br />
              <em>
                Hospitals:&nbsp; Each $1 saved in energy costs is equivalent to generating new revenues of $20 for hospitals, or $10 for medical offices
                and nursing homes.
                <br />
                <br />
                Hotels:&nbsp; A 10% reduction in energy costs is equivalent to increasing Average Daily Room rates by $.62 for limited-service hotels
                and $1.35 for full-service hotels.
                <br />
                <br />
                Office Buildings:&nbsp; Saving 30% of energy costs in a commercial office building is equivalent to increasing the net operating income
                by 4%, which would support a 4% increase in asset value.
                <br />
                <br />
                Supermarkets:&nbsp; For the average supermarket, reducing energy costs by 10% is equivalent to increasing sales per square foot by
                nearly $42.
              </em>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            What kinds of HVACR equipment can use PACE AI?
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              PACE AI helps you save on what you’ve got — effective on 90% of what cools and heats the world, on process heating and cooling equipment,
              and other applications, too. Patented, breakthrough PACE AI edge+cloud solutions combine a rugged, easily-deployed Industrial Internet of
              Things (IIoT) edge node and sensor suite for monitoring, predictive maintenance, and optimization, all with cloud-based AI/ML for
              optimizing HVACR and process heating and cooling, as well as other applications. In tens of thousands of installations and in over 90
              industry-standard metered trials, PACE AI has delivered 25%-30%+ cost and carbon savings for a huge range of applications and equipment
              types.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            What factors determine HVAC and other Unit energy consumption and dollar savings achieved?
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              As usual in energy efficiency and demand reduction, the primary factors that affect baseline energy consumption, and thus energy savings
              off that baseline are (in typical order of effect): (1) the size of the controlled HVAC or other equipment, (2) the all-in $ energy cost
              per kWh or therm for the equipment, (3) the hours of annual run time for the appliance, and (4) the baseline energy efficiency of the HVAC
              or other unit. Thus, larger, longer-running HVACR units in higher-cost areas will have the highest operating costs, and thus have the best
              paybacks for PACE AI installation. However, the percentage savings noted above will generally be achieved, thus dollar savings will be
              higher for those larger and longer-running HVAC units in higher-cost areas.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            How are Unit and Site energy and demand data collected and represented?
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              Energy is presented for each Unit and for each Site as a cumulated sum (e.g., in kWh or therms). Temperature, pressure, and other state
              variables are presented as integrated average on a 15-minute rolling basis.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            For HVAC and other Units, how are PACE AI Node temperature and other sensors mounted?
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              Temperature and other sensors are mounted in positions that will provide the best feedback to the cloud-based AI/ML in its optimizations.
              For instance, for an HVAC DX packaged heating/cooling unit, 1 temperature sensor each (total of 2 sensors) will be placed in the supply
              air and return air ducting, close to any existing OEM temperature sensors. For an HVAC chiller unit, 1 temperature sensor each will be
              placed on the supply and return chilled water lines. For an HVAC split system heat pump, the air-side supply and return air ducting in the
              air handling unit (AHU) is the typical sensor location. See the installation instructions for further details.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            Can PACE AI improve comfort in existing HVAC systems?
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              In many heating and air conditioning applications, addition of PACE AI can improve user comfort. Time and again, PACE AI has been shown to
              minimize overshooting or undershooting of the temperature called for by the thermostat, with heated or cooled air provided more constantly
              at a more moderate temperature, closer to the desired level. In particular, PACE AI in heating systems has been noted to reduce
              uncomfortable temperature overshoots in morning warmup periods, e.g., in box retail stores.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            How is PACE AI complementary with and additive to smart thermostats and building management systems?
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              PACE AI is complementary with and additive to all smart thermostats building management systems (BMS), in applying patented cloud-based
              AI/ML to produce a dynamic and more energy-efficient response to the call for cooling or heating, from the thermostat or BMs. Most current
              PACE AI installations are in buildings that have some form of smart thermostats or BMS, and most BMS are designed to allow benefits such
              as remote thermostatic control with setbacks, equipment run time normalization, monitoring and reporting, online diagnostics, prevention
              of harm from poor electricity quality, and similar features. In contrast, PACE AI technology is focused on the “foundation” of energy
              consumption, by applying cloud-based AI/ML at the edge to optimize machine response to control inputs. For a BMS or a process automation
              system, PACE AI thus operates in response, but quite compatibly and visibly with the system, and with easy interconnection.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            Where can I review other PACE AI services?
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              Please see the Services menu, and{" "}
              <Link href="/contact-us" target="_blank" rel="noopener">
                contact us
              </Link>{" "}
              for more revenue-adding and cost-cutting options including Demand Response, Fault Detection, Predictive Smart Building, API Data Link, and
              Utility Bill Analysis.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            What resources are available for technical support?
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              See the{" "}
              <Link href="https://www.pacecontrols.com" target="_blank" rel="noopener">
                PACE AI website
              </Link>{" "}
              or call 1-877-PACE-HVAC (1-877-722-3482), Option 2.
            </Typography>
          </AccordionDetails>
        </Accordion>

      </Box>
      <Box sx={{ mt: "auto", width: "100%" }}>
        <InfoFooter />
      </Box>
    </Box>
  );
}
