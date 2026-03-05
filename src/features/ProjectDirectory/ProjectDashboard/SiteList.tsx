import { Chip, Autocomplete, TextField } from "@mui/material";

interface SiteListProps {
  options: any;
  selectedSiteOptions: any;
  setSelectedSiteOptions: any;
}

export default function SiteList({ options, selectedSiteOptions, setSelectedSiteOptions }: SiteListProps) {
  const handleChange = (event: any, value: any[]) => {
    if (value.some((option: any) => option.site_name === "All sites")) {
      setSelectedSiteOptions([options.find((option: any) => option.site_name === "All sites")]);
    } else {
      setSelectedSiteOptions(value);
    }
  };

  return (
    <Autocomplete
      multiple
      id="tags-filled"
      options={options}
      getOptionLabel={(option: any) => option.site_name}
      value={selectedSiteOptions}
      onChange={handleChange}
      renderTags={(value: readonly any[], getTagProps) =>
        value.map((option: any, index: number) => {
          const { key, ...tagProps } = getTagProps({ index });
          return <Chip variant="outlined" label={option.site_name} key={key} {...tagProps} size="small" />;
        })
      }
      renderInput={(params) => <TextField {...params} label="Site" placeholder="Site" />}
      getOptionDisabled={(option: any) =>
        selectedSiteOptions.some((selected: any) => selected.site_name === "All sites") && option.site_name !== "All sites"
      }
    />
  );
}
